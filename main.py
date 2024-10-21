from fastapi import FastAPI, UploadFile, File
from detector import Detector
import numpy as np
import os

app = FastAPI()

alpha_rhythms = []
theta_rhythms = []
dcs = []
threshold = 0

# Initialize the detector object
detector = Detector()

@app.get("/")
async def root():
    return {"message": "EEG Fatigue Detection API"}

@app.post("/set_baseline")
async def set_baseline(file: UploadFile = File(...)):
    """
    Set the baseline for the detector using the given EEG data.
    """
    global threshold
    file_location = f"files/{file.filename}"
    
    # Save the uploaded file temporarily
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    # Set the baseline using the uploaded file
    detector.set_baseline(file_location)
    
    threshold = detector.get_threshold()
    
    # Remove the temporary file after processing
    os.remove(file_location)
    
    return {"status": "Baseline set successfully"}

@app.post("/process")
async def process(file: UploadFile = File(...)):
    """
    Process the uploaded EEG data to extract alpha and theta rhythms.
    """
    file_location = f"files/{file.filename}"
    
    # Save the uploaded file temporarily
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    # Process the EEG file
    detector.process(file_location)
    
    alpha_rhythms.append(detector.get_alpha_rhythms())
    theta_rhythms.append(detector.get_theta_rhythms())
    dcs.append(detector.get_dc())
    
    # Remove the temporary file after processing
    os.remove(file_location)
    
    return {"status": "EEG data processed successfully"}

@app.get("/alpha_rhythms")
async def get_alpha_rhythms():
    """
    Get the extracted alpha rhythms.
    """
    return {"alpha_rhythms": alpha_rhythms}

@app.get("/theta_rhythms")
async def get_theta_rhythms():
    """
    Get the extracted theta rhythms.
    """
    return {"theta_rhythms": theta_rhythms}

@app.get("/dcs")
async def get_dcs():
    """
    Get the computed deviation (DC) values.
    """
    return {"dcs": dcs}

@app.get("/threshold")
async def get_threshold():
    """
    Get the current fatigue detection threshold.
    """
    return {"threshold": threshold}
