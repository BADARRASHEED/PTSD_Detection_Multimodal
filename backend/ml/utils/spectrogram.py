import os
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt


class Params:
    def __init__(self):
        self.sample_rate = 16000.0
        self.stft_window_seconds = 0.025
        self.stft_hop_seconds = 0.010
        self.mel_bands = 64
        self.mel_min_hz = 125.0
        self.mel_max_hz = 7500.0
        self.log_offset = 0.01
        self.patch_window_seconds = 27.96
        self.patch_hop_seconds = 15.0
        self.tflite_compatible = False

    @property
    def patch_frames(self):
        return int(round(self.patch_window_seconds / self.stft_hop_seconds))

    @property
    def patch_bands(self):
        return self.mel_bands


def pad_waveform(waveform, params):
    min_waveform_seconds = (
        params.patch_window_seconds
        + params.stft_window_seconds
        - params.stft_hop_seconds
    )
    min_num_samples = tf.cast(min_waveform_seconds * params.sample_rate, tf.int32)
    num_samples = tf.shape(waveform)[0]
    num_padding_samples = tf.maximum(0, min_num_samples - num_samples)

    num_samples = tf.maximum(num_samples, min_num_samples)
    num_samples_after_first_patch = num_samples - min_num_samples
    hop_samples = tf.cast(params.patch_hop_seconds * params.sample_rate, tf.int32)
    num_hops_after_first_patch = tf.cast(
        tf.math.ceil(
            tf.cast(num_samples_after_first_patch, tf.float32)
            / tf.cast(hop_samples, tf.float32)
        ),
        tf.int32,
    )
    num_padding_samples += (
        hop_samples * num_hops_after_first_patch - num_samples_after_first_patch
    )

    padded_waveform = tf.pad(
        waveform, [[0, num_padding_samples]], mode="CONSTANT", constant_values=0.0
    )
    return padded_waveform


def waveform_to_log_mel_spectrogram_patches(waveform, params):
    window_length_samples = int(round(params.sample_rate * params.stft_window_seconds))
    hop_length_samples = int(round(params.sample_rate * params.stft_hop_seconds))
    fft_length = 2 ** int(np.ceil(np.log2(window_length_samples)))
    magnitude_spectrogram = tf.abs(
        tf.signal.stft(
            signals=waveform,
            frame_length=window_length_samples,
            frame_step=hop_length_samples,
            fft_length=fft_length,
        )
    )

    num_spectrogram_bins = fft_length // 2 + 1
    mel_weight_matrix = tf.signal.linear_to_mel_weight_matrix(
        num_mel_bins=params.mel_bands,
        num_spectrogram_bins=num_spectrogram_bins,
        sample_rate=params.sample_rate,
        lower_edge_hertz=params.mel_min_hz,
        upper_edge_hertz=params.mel_max_hz,
    )

    mel_spectrogram = tf.matmul(magnitude_spectrogram, mel_weight_matrix)
    log_mel_spectrogram = tf.math.log(mel_spectrogram + params.log_offset)

    spec_sr = params.sample_rate / hop_length_samples
    patch_win_len = int(round(spec_sr * params.patch_window_seconds))
    patch_hop_len = int(round(spec_sr * params.patch_hop_seconds))

    features = tf.signal.frame(
        signal=log_mel_spectrogram,
        frame_length=patch_win_len,
        frame_step=patch_hop_len,
        axis=0,
    )

    return log_mel_spectrogram, features


def load_and_extract_spectrogram_patches(audio_path, params):
    audio_binary = tf.io.read_file(audio_path)
    waveform, _ = tf.audio.decode_wav(audio_binary)

    if waveform.shape[-1] == 2:
        waveform = tf.reduce_mean(waveform, axis=-1)  # Convert stereo to mono
    if len(waveform.shape) == 2 and waveform.shape[-1] == 1:
        waveform = tf.squeeze(waveform, axis=-1)

    waveform = pad_waveform(waveform, params)
    log_spec, patches = waveform_to_log_mel_spectrogram_patches(waveform, params)
    return patches


def save_patches_as_images(patches, output_dir, base_filename):
    os.makedirs(output_dir, exist_ok=True)
    num_patches = patches.shape[0]

    for i in range(num_patches):
        patch = patches[i].numpy()
        plt.figure(figsize=(4, 4))
        plt.imshow(patch.T, aspect="auto", origin="lower")
        plt.axis("off")
        plt.savefig(
            os.path.join(output_dir, f"{base_filename}_patch_{i}.png"),
            bbox_inches="tight",
            pad_inches=0,
        )
        plt.close()


def process_audio_file(audio_path, output_dir):
    """
    Main function to convert .wav audio into multiple spectrogram patch images.

    Args:
        audio_path (str): path to .wav file
        output_dir (str): output directory to save patches
    """
    params = Params()
    patches = load_and_extract_spectrogram_patches(audio_path, params)
    filename = os.path.splitext(os.path.basename(audio_path))[0]
    save_patches_as_images(patches, output_dir, filename)


"""

== Example Usage ==

from ml.utils.spectrogram import process_audio_file

process_audio_file(
    audio_path="temp/audio/uploaded_video.wav",
    output_dir="temp/spectrogram_patches"
)


== Simple Visualization (like sliding window) ==

Audio:      |--------------------------- 60 seconds ----------------------------|

Patch 1:    |--------- 27.96s ---------|
Patch 2:             |--------- 27.96s ---------|
Patch 3:                       |--------- 27.96s ---------|



- Patch 1 starts at 0s → goes till ~28s

- Patch 2 starts at 15s → goes till ~43s

- Patch 3 starts at 30s → goes till ~58s

"""
