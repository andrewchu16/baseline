import numpy as np
import mne
from detection_util import preprocess_eeg, extract_rhythms, combined_deviation, detect_fatigue, read_eeg_data


def fatigue(eeg_data: np.ndarray, threshold=6.0) -> bool:
    DC = calculate_dc(eeg_data)
    
    is_fatigued: bool = detect_fatigue(DC, threshold)
    # print("Fatigue detected:", is_fatigued)
    
    return is_fatigued

def calculate_dc(edf_file_name: str) -> float:
    """
    Calculate the combined deviation (DC) based on the given EEG data.
    """
    sfreq: float = 256.0
    
    # Read EEG data from file
    raw_data: mne.io.Raw = read_eeg_data(edf_file_name, sfreq)

    # Baseline and remove artifacts
    cleaned_data: mne.io.Raw = preprocess_eeg(raw_data)

    # Extract rhythms
    alpha_rhythms, theta_rhythms = extract_rhythms(cleaned_data, sfreq)

    # Compute Mahalanobis distance and combined deviation (DC)
    mean_alpha = np.mean(alpha_rhythms, axis=1)
    cov_alpha = np.cov(alpha_rhythms)
    mean_theta = np.mean(theta_rhythms, axis=1)
    cov_theta = np.cov(theta_rhythms)

    DC: float = combined_deviation(alpha_rhythms[:, 0], theta_rhythms[:, 0], mean_alpha, cov_alpha, mean_theta, cov_theta)
    
    return DC

if __name__ == "__main__":
    edf_file_name = "block1.edf"
    sfreq: float = 256.0
    
    # Read EEG data from file
    raw_data: mne.io.Raw = read_eeg_data(edf_file_name, sfreq)

    # Baseline and remove artifacts
    cleaned_data: mne.io.Raw = preprocess_eeg(raw_data)

    # Extract rhythms
    alpha_rhythms, theta_rhythms = extract_rhythms(cleaned_data, sfreq)
    
    # Compute Mahalanobis distance and combined deviation (DC)
    mean_alpha = np.mean(alpha_rhythms, axis=1)
    cov_alpha = np.cov(alpha_rhythms)
    mean_theta = np.mean(theta_rhythms, axis=1)
    cov_theta = np.cov(theta_rhythms)
    
    dcs = []
    for i in range(200):
        dc = combined_deviation(alpha_rhythms[:, 0], theta_rhythms[:, 0], mean_alpha, cov_alpha, mean_theta, cov_theta)
        dcs.append(dc)
        
    