import mne
from mne.preprocessing import ICA
import numpy as np
import pywt
from typing import Tuple, List
from scipy.spatial.distance import mahalanobis

def read_eeg_data(edf_file_path: str, sfreq=256.) -> mne.io.Raw:
    """
    Reads EEG data from an EDF file, returns the data as a (channels, time samples) array.
    """
    raw = mne.io.read_raw_edf(edf_file_path, preload=True)
    
    montage = mne.channels.make_standard_montage('standard_1020')
    eeg_channels = ['Cz', 'Fp1', 'F7', 'P3', 'O1', 'Pz', 'O2', 'P4', 'F8', 'Fp2']

    raw.pick(eeg_channels)
    raw.set_montage(montage)
    
    raw.resample(sfreq)
    
    return raw

def preprocess_eeg(raw: mne.io.Raw) -> mne.io.Raw:
    """
    Apply Blind Source Separation (BSS) using Independent Component Analysis (ICA)
    to remove artifacts from the EEG data.
    
    Parameters:
    - sfreq: Sampling frequency of the EEG data.
    
    Returns:
    - Raw object with cleaned EEG data after ICA.
    """
    # Apply band-pass filter (1-50 Hz) to remove very low and high frequency noise
    raw.filter(1.0, 50.0, fir_design='firwin')
    
    raw.del_proj()
    
    # Fit ICA to the raw EEG data
    ica = ICA(n_components=10, random_state=97)
    ica.fit(raw)
    
    # Apply ICA to remove artifacts
    raw_cleaned = ica.apply(raw)
    
    return raw_cleaned

def extract_rhythms(raw_cleaned_data: mne.io.Raw, sfreq: float, 
                    alpha_band=(8, 12), 
                    theta_band=(4, 8)):
    """
    Extract alpha (8-12 Hz) and theta (4-8 Hz) rhythms.
    
    Parameters:
    - raw_cleaned_data: Cleaned EEG data in MNE Raw format.
    - sfreq: Sampling frequency.
    - alpha_band: Tuple representing the frequency range for alpha rhythm.
    - theta_band: Tuple representing the frequency range for theta rhythm.
    
    Returns:
    - Tuple containing two NumPy arrays: (alpha_rhythms, theta_rhythms).
    """
    eeg_data: np.ndarray = raw_cleaned_data.get_data()  # (channels x time samples)
    coeffs_alpha: List[np.ndarray] = []
    coeffs_theta: List[np.ndarray] = []
    
    for channel_data in eeg_data:
        # Perform continuous wavelet transform (CWT) for each channel
        coeffs, freqs = pywt.cwt(channel_data, scales=np.arange(1, 128), wavelet='morl', sampling_period=1/sfreq)
        
        # Extract alpha and theta power using the specified frequency bands
        alpha_power = np.mean([coeffs[i] for i, f in enumerate(freqs) if alpha_band[0] <= f <= alpha_band[1]], axis=0)
        theta_power = np.mean([coeffs[i] for i, f in enumerate(freqs) if theta_band[0] <= f <= theta_band[1]], axis=0)
        
        coeffs_alpha.append(alpha_power)
        coeffs_theta.append(theta_power)
    
    return np.array(coeffs_alpha), np.array(coeffs_theta)

def mahalanobis_distance(rhythm_data: np.ndarray, mean_vector: np.ndarray, cov_matrix: np.ndarray) -> float:
    """
    Calculate the Mahalanobis distance for the given rhythm data.
    """
    return mahalanobis(rhythm_data, mean_vector, np.linalg.inv(cov_matrix))
    # return np.sqrt((rhythm_data - mean_vector).T @ np.linalg.inv(cov_matrix) @ (rhythm_data - mean_vector))

def combined_deviation(alpha_data: np.ndarray, theta_data: np.ndarray, 
                       mean_alpha: np.ndarray, cov_alpha: np.ndarray, 
                       mean_theta: np.ndarray, cov_theta: np.ndarray, 
                       sigma: float = 0.5) -> float:
    """
    Calculate the combined deviation (DC) based on weighted Mahalanobis distances of alpha and theta rhythms.
    
    Returns:
    - Combined deviation
    """
    D_alpha: float = mahalanobis_distance(alpha_data, mean_alpha, cov_alpha)
    D_theta: float = mahalanobis_distance(theta_data, mean_theta, cov_theta)
    
    # Weighted sum of distances
    DC: float = sigma * D_alpha + (1 - sigma) * D_theta
    return DC

def detect_fatigue(DC: float, threshold: float=6.0) -> bool:
    """
    TODO: Calculate threshold dynamically
    DC > threshold
    """
    return DC > threshold