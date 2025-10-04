
import torch
import numpy as np
import pandas as pd
import librosa
from model_torch import Audio2EmotionModel

FRAME_SIZE = 512
HOP_LENGTH = 256
DURATION = 15
SAMPLE_RATE = 22050
MONO = True

def rescale(scores: np.ndarray) -> np.ndarray:
    """
    Rescale the model output back into original range (1 ~ 10)
    
    Args:
        scores: the model prediction in [0,1], shape (B, 8)

    Returns:
        Rescaled model prediction, shape (B, 8)
    """
    return scores * 10

def print_scores(scores: np.ndarray) -> None:
    """
    Pretty print for print out scores 
    """
    df = pd.DataFrame(scores, columns=['valence', 'energy', 'tension', 
                                       'anger', 'fear', 'happy', 'sad', 'tender'])
    print(df)

def main():
    # config
    checkpoint_path = 'weights/best.pth'
    audio_path = '/home/nithish/Desktop/MusicEmotionDetection-main/data/audio/015.mp3'

    # init model and loading weights
    model = Audio2EmotionModel()
    try:
        model.load_state_dict(torch.load(checkpoint_path, map_location=torch.device('cpu')))
    except FileNotFoundError:
        print("Error: Model checkpoint not found.")
        return
    except Exception as e:
        print("Error: ", str(e))
        return
    model.eval()

    # Load audio
    y, sr = librosa.load(audio_path, sr=None)
    y = librosa.resample(y.astype(np.float32), orig_sr=sr, target_sr=SAMPLE_RATE)

    # Pad or truncate
    num_samples = int(DURATION * SAMPLE_RATE)
    if len(y) < num_samples:
        y = np.pad(y, (0, num_samples - len(y)), "constant")
    else:
        y = y[:num_samples]

    # Extract spectrogram
    stft = librosa.stft(y, n_fft=FRAME_SIZE, hop_length=HOP_LENGTH)[:-1]
    spectrogram = np.abs(stft)
    log_spectrogram = librosa.amplitude_to_db(spectrogram)

    # add batch, channel dim
    log_spectrogram = np.expand_dims(log_spectrogram, (0, 1))

    log_spectrogram = torch.tensor(log_spectrogram)

    # inference
    with torch.no_grad():
        pred = model(log_spectrogram)
        pred = pred.numpy()

        # shape check: if single batch add batch dim
        if len(pred.shape) == 1:
            pred = np.expand_dims(pred, 0)

        # rescale
        pred_rescaled = rescale(pred)
        # print result
        print("Emotion predictions for " + audio_path)
        print_scores(pred_rescaled)

if __name__ == '__main__':
    main()