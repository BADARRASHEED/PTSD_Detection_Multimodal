import sys
import types

# ----- create minimal torch stub -----
torch_stub = types.ModuleType('torch')
class _Tensor(list):
    def unsqueeze(self, dim):
        return self
    def to(self, device):
        return self

def tensor(data, dtype=None):
    if isinstance(data, list):
        return _Tensor(data[0] if len(data)==1 else data)
    return _Tensor([data])

def zeros(*shape):
    return _Tensor([0])

def argmax(x, dim=None):
    class _Res:
        def __init__(self, val):
            self._v = val
        def item(self):
            return self._v
    return _Res(0 if x[0] >= x[1] else 1)

class _no_grad:
    def __enter__(self):
        pass
    def __exit__(self, exc_type, exc, tb):
        pass

torch_stub.tensor = tensor
torch_stub.zeros = zeros
torch_stub.argmax = argmax
torch_stub.no_grad = lambda: _no_grad()
torch_stub.device = lambda x: None
torch_stub.ones = lambda n: [1]*n
torch_stub.Tensor = _Tensor
torch_stub.cuda = types.SimpleNamespace(is_available=lambda: False)

torch_stub.cat = lambda lst, dim=0: lst[0]

class Module:
    def eval(self):
        return self
    def to(self, device):
        return self
    def __call__(self, *args, **kwargs):
        if hasattr(self, "forward"):
            return self.forward(*args, **kwargs)
        return None

nn_stub = types.ModuleType('torch.nn')
nn_stub.Module = Module
nn_stub.Parameter = lambda x: x
nn_stub.Linear = nn_stub.Conv3d = nn_stub.AdaptiveAvgPool3d = nn_stub.Flatten = nn_stub.LayerNorm = nn_stub.Dropout = lambda *a, **k: None

torch_stub.nn = nn_stub
sys.modules['torch'] = torch_stub
sys.modules['torch.nn'] = nn_stub

# other stubs
sys.modules['torchvision'] = types.ModuleType('torchvision')
tv_transforms = types.ModuleType('torchvision.transforms')
tv_transforms.Compose = lambda x: None
tv_transforms.Resize = lambda size: None
tv_transforms.ToTensor = lambda: None
tv_transforms.Normalize = lambda mean, std: None
sys.modules['torchvision.transforms'] = tv_transforms
tv_models = types.ModuleType('torchvision.models')
tv_models.efficientnet_v2_l = lambda weights=None: Module()
sys.modules['torchvision.models'] = tv_models
sys.modules['PIL'] = types.ModuleType('PIL')
image_mod = types.ModuleType('Image')
image_mod.open = lambda p: types.SimpleNamespace(convert=lambda mode: None)
sys.modules['PIL.Image'] = image_mod
sys.modules['joblib'] = types.ModuleType('joblib')

import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.models import predictor

class StubTextModel(Module):
    def forward(self, texts):
        l = len(texts[0])
        # return higher second value when text is long
        if l < 5:
            return tensor([[1.0, 0.0]])
        else:
            return tensor([[0.0, 1.0]])

class StubModel(Module):
    def __init__(self):
        self.tm = StubTextModel()
    def forward(self, vid, aud, text_feat):
        return text_feat


def stub_load_frames(folder):
    return zeros(3, predictor.SEQ_LEN, 224, 224)

def stub_load_specs(folder, prefix):
    return zeros(3, predictor.SEQ_LEN, 224, 224)


def test_predictions_change_with_text(monkeypatch):
    stub_model = StubModel()
    monkeypatch.setattr(predictor, "load_fusion_model", lambda: stub_model)
    monkeypatch.setattr(predictor, "load_video_frames", stub_load_frames)
    monkeypatch.setattr(predictor, "load_spectrograms", stub_load_specs)

    pred1 = predictor.predict_fusion_model("spec", "frames", "hi", "base")
    pred2 = predictor.predict_fusion_model("spec", "frames", "longtext", "base")
    assert pred1 != pred2
