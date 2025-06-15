import torch
import torch.nn as nn


class PTSDVideoTransformer(nn.Module):
    """
    Video branch: Tubelet embedding via 3D conv → pooling → 256-dim → logits.
    Used in inference to extract video features.
    """

    def __init__(self, num_classes=2):
        super().__init__()
        self.conv = nn.Conv3d(
            in_channels=3, out_channels=256, kernel_size=(1, 16, 16), stride=(1, 16, 16)
        )
        self.pool = nn.AdaptiveAvgPool3d((1, 1, 1))
        self.flatten = nn.Flatten()
        self.proj = nn.Linear(256, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, 3, T, H, W)
        feat = self.conv(x)  # → (B, 256, T', H', W')
        feat = self.pool(feat)  # → (B, 256, 1, 1, 1)
        feat = self.flatten(feat)  # → (B, 256)
        return self.proj(feat)  # → (B, NUM_CLASSES)

    def extract_feature(self, x: torch.Tensor) -> torch.Tensor:
        # Used to get 256-dim vector (before final classification)
        feat = self.conv(x)
        feat = self.pool(feat)
        return self.flatten(feat)  # → (B, 256)


class FusionHead(nn.Module):
    """
    Fusion head with learnable weights for each modality.
    Input: concatenated video, text, audio embeddings → output logits.
    """

    def __init__(self, nc=2):
        super().__init__()
        self.wv = self.wa = self.wt = nn.Parameter(torch.ones(1))
        self.norm = nn.LayerNorm(nc * 3)
        self.dp = nn.Dropout(0.3)
        self.fc = nn.Linear(nc * 3, nc)

    def forward(self, v, t, a):
        # v, t, a: (B, nc)
        fused = torch.cat([self.wv * v, self.wt * t, self.wa * a], dim=1)  # (B, nc*3)
        fused = self.norm(fused)
        fused = self.dp(fused)
        return self.fc(fused)  # (B, nc)


class LateFusion(nn.Module):
    """
    Full model combining video, text, and audio modalities.
    """

    def __init__(self, vm, tm, am, nc=2):
        super().__init__()
        self.vm = vm  # PTSDVideoTransformer
        self.tm = tm  # text model
        self.am = am  # EfficientNetV2
        self.head = FusionHead(nc)

    def forward(self, vids, auds, text_feat):
        # === Video ===
        v = self.vm(vids)  # (B, nc)

        # === Audio ===
        B, C, T, H, W = auds.shape
        x = auds.permute(0, 2, 1, 3, 4).reshape(B * T, C, H, W)  # (B*T, C, H, W)
        fl = self.am(x)  # (B*T, nc)
        a = fl.view(B, T, -1).mean(dim=1)  # (B, nc)

        # === Text ===
        # ``text_feat`` is expected to be a tensor of shape ``(B, nc)`` already
        # computed by the text model.
        t = text_feat

        # === Fusion ===
        return self.head(v, t, a)  # (B, nc)
