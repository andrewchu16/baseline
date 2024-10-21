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

def get_rhythm_means_and_cov(edf_file_name: str) -> tuple:
    """
    Extract mean alpha and theta rhythms from the given EEG data.
    """
    sfreq: float = 256.0
    
    # Read EEG data from file
    raw_data: mne.io.Raw = read_eeg_data(edf_file_name, sfreq)

    # Baseline and remove artifacts
    cleaned_data: mne.io.Raw = preprocess_eeg(raw_data)

    # Extract rhythms
    alpha_rhythms, theta_rhythms = extract_rhythms(cleaned_data, sfreq)
    
    mean_alpha = np.mean(alpha_rhythms, axis=1)
    mean_theta = np.mean(theta_rhythms, axis=1)
    
    cov_alpha = np.cov(alpha_rhythms)
    cov_theta = np.cov(theta_rhythms)
    
    return mean_alpha, mean_theta, cov_alpha, cov_theta

def calculate_dcs_from_baseline(base_mean_alpha: np.ndarray, base_mean_theta: np.ndarray, base_cov_alpha: np.ndarray, base_cov_theta: np.ndarray, eeg_data: np.ndarray) -> list:
    """
    Calculate the combined deviation (DC) based on the given EEG data.
    """
    dcs = []
    alpha_rhythms, theta_rhythms = extract_rhythms(eeg_data, 256.0)
    for i in range(len(eeg_data)):
        dc = combined_deviation(alpha_rhythms[:, i], theta_rhythms[:, i], base_mean_alpha, base_cov_alpha, base_mean_theta, base_cov_theta)
        dcs.append(dc)
    
    return dcs

if __name__ == "__main__":
    base_edf_file_name = r"C:\Users\andre\projects\baseline\hardware-check\subj_1\session_02\block_01\Subject 1, Session 1, Block 1 Recording_FLEX2_213075_2024.08.14T11.51.10.04.00.md.edf"
    
    mean_alpha, mean_theta, cov_alpha, cov_theta = get_rhythm_means_and_cov(base_edf_file_name)
    
    import os

    # Root directory containing nested folders
    root_dir = './hardware-check/subj_1/session_02'
    
    avg_dcs = []

    # Iterate over all .edf files in the directory and subdirectories
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.edf'):
                edf_path = os.path.join(dirpath, filename)
                
                raw_data = read_eeg_data(edf_path)
                clean_data = preprocess_eeg(raw_data)
                
                dcs = calculate_dcs_from_baseline(mean_alpha, mean_theta, cov_alpha, cov_theta,  clean_data)
                
                print(np.mean(dcs))
                avg_dcs.append(np.mean(dcs))
                
    print(avg_dcs)