import numpy as np

# determine the threshold value for the combined deviation (DC) based on the user's brain activity data at the beginning of the session.

# assume the DC values are normally distributed, we can calculate the threshold as a certain number of standard deviations away from the mean.

# record the user's brain data for a minute, taking samples 

# using the recorded data, calculate the mean and standard deviation of the DC values

# then set the threshold as the mean plus a certain number of standard deviations (e.g., 3).

def calculate_threshold(data: np.ndarray, sigma: float = 3.0) -> float:
    """
    Calculate the threshold value for the combined deviation (DC) based on the user's brain activity data.
    
    Parameters:
    - data: Array of DC values.
    - sigma: Number of standard deviations away from the mean.
    
    Returns:
    - Threshold value as a float.
    """
    mean: float = np.mean(data)
    std_dev: float = np.std(data)
    threshold: float = mean + sigma * std_dev
    return threshold