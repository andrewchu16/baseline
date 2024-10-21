import numpy as np
import mne
from detection_util import preprocess_eeg, extract_rhythms, combined_deviation, detect_fatigue, read_eeg_data


class Detector:
    def __init__(self):
        self.base_mean_alpha: np.ndarray = None
        self.base_mean_theta: np.ndarray = None
        self.base_cov_alpha: np.ndarray = None
        self.base_cov_theta: np.ndarray = None
        
        self.threshold = 0.
        
        self.alpha_rhythms: np.ndarray = None
        self.theta_rhythms: np.ndarray = None
        self.dc = 0.
        
        self.sigma = 0.5
        
    def set_baseline(self, edf_file_name: str):
        """
        Set the baseline for the detector using the given EEG data.
        """
        raw_data = read_eeg_data(edf_file_name, sfreq=256.0)
        
        cleaned_data = preprocess_eeg(raw_data)
        
        alpha_rhythms, theta_rhythms = extract_rhythms(cleaned_data, sfreq=256.0)
        
        self.base_mean_alpha = np.mean(alpha_rhythms, axis=1)
        self.base_mean_theta = np.mean(theta_rhythms, axis=1)
        
        self.base_cov_alpha = np.cov(alpha_rhythms)
        self.base_cov_theta = np.cov(theta_rhythms)
        
        dc = 0
        for i in range(alpha_rhythms.shape[1]):
            dc += combined_deviation(alpha_rhythms[:, i], theta_rhythms[:, i], self.base_mean_alpha, self.base_cov_alpha, self.base_mean_theta, self.base_cov_theta, self.sigma)
        dc /= alpha_rhythms.shape[1]
        
        self.threshold = dc + 0.15
        
    def process(self, edf_file_name: str):
        """
        Process the given EEG data and extract the alpha and theta rhythms.
        """
        raw_data = read_eeg_data(edf_file_name, sfreq=256.0)
        
        cleaned_data = preprocess_eeg(raw_data)
        
        self.alpha_rhythms, self.theta_rhythms = extract_rhythms(cleaned_data, sfreq=256.0)
        
    def check_initialized(self):
        """
        Check if the detector is initialized properly.
        """
        if self.base_cov_theta is None or self.base_mean_alpha is None or self.base_mean_theta is None or self.base_cov_alpha is None:
            return False
        return True
        
    def check_is_processed(self):
        """
        Check if the data is processed.
        """
        if self.alpha_rhythms is None or self.theta_rhythms is None:
            return False
        return True
        
    def detect_fatigue(self):
        """
        Detect fatigue based on the extracted rhythms.
        """
        if not self.check_initialized():
            raise ValueError("Detector is not initialized.")
        
        if not self.check_is_processed():
            raise ValueError("Data is not processed.")
        
        # Calculate DC across time samples
        dcs = []
        for i in range(self.alpha_rhythms.shape[1]):
            dc = combined_deviation(self.alpha_rhythms[:, i], self.theta_rhythms[:, i], self.base_mean_alpha, self.base_cov_alpha, self.base_mean_theta, self.base_cov_theta)
            dcs.append(dc)
            
        self.dc = float(np.mean(dcs))
        
        return self.dc > self.threshold
    
    def get_alpha_rhythms(self):
        """
        Get the extracted alpha rhythms. (channels x time samples)
        """
        if not self.check_is_processed():
            raise ValueError("Data is not processed.")
        
        return self.alpha_rhythms
    
    def get_theta_rhythms(self):
        """
        Get the extracted theta rhythms. (channels x time samples)
        """
        if not self.check_is_processed():
            raise ValueError("Data is not processed.")
        
        return self.theta_rhythms
    
    def get_dc(self):
        """
        Get the combined deviation (DC).
        """
        if not self.check_is_processed():
            raise ValueError("Data is not processed.")
        
        return self.dc
    
    def get_threshold(self):
        """
        Get the current fatigue detection threshold.
        """
        return self.threshold