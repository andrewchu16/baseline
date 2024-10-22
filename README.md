# Baseline!
Welcome to Baseline, a neurotech application for detecting fatigue levels in real-time using EEG data.

## How It Works
First, Baseline records your brain in its well-rested state using an EEG headset. Then, during mentally taxing activities like surgery, it collects your brain wave activity so it can determine when you need to take a break.

## Methodology
Baseline uses a methodology similar to this paper to analyze EEG brainwaves. It focuses on analyzing alpha and theta waves which are related to wakefulness, relaxation, and focus.

1. Reads in live EEG data in 15-second intervals
2. Performs artifact removal (ICA) and filtering
3. Extracts alpha and theta wavelets
4. Analyzes relative strengths of alpha and theta waves
5. Outputs fatigue level relative to baseline

## Project Structure
Frontend: in the `frontend` folder
Backend: `server.py`, `detector.py`, and `detection_util.py`. All the other Python and Jupyter notebook files were used to test the detection method.

## Technologies Used
**Frontend**: React, TailwindCSS, Axios 
**Backend**: Python, FastAPI 
**Analysis**: NumPy, SciPy, PyWavelet, MNE, Matplotlib
