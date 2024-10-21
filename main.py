from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from detector import Detector
import numpy as np
import os

app = FastAPI()

origins = [
    "http://localhost:5173",  # React frontend
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dcs = []

# Initialize the detector object
detector = Detector()

@app.get("/")
async def root():
    return {"message": "Baseline API"}

@app.post("/set_baseline")
async def set_baseline(file: UploadFile = File(...)):
    """
    Set the baseline for the detector using the given EEG data.
    """
    file_location = f"files/{file.filename}"
    
    # Save the uploaded file temporarily
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    # Set the baseline using the uploaded file
    detector.set_baseline(file_location)
    
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
    detector.detect_fatigue()
    
    dcs.append(detector.get_dc())
    
    # Remove the temporary file after processing
    os.remove(file_location)
    
    return {"status": "EEG data processed successfully"}

@app.get("/alpha_rhythms")
async def get_alpha_rhythms():
    """
    Get the extracted alpha rhythms.
    """
    return {"alpha_rhythms": detector.get_alpha_rhythms().tolist()}

@app.get("/theta_rhythms")
async def get_theta_rhythms():
    """
    Get the extracted theta rhythms.
    """
    return {"theta_rhythms": detector.get_theta_rhythms().tolist()}

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
    return {"threshold": detector.get_threshold()}

@app.get("/status")
async def get_status():
    """
    Get the current application status.
    """
    return {
        "initialized": detector.check_initialized(),
        "processed": detector.check_is_processed()
    }
    
@app.get("/fatigue_status")
async def get_fatigue_status():
    """
    Get the current fatigue status.
    """
    is_fatigued = bool(detector.get_dc() > detector.get_threshold())
    return {"dc": float(detector.get_dc()),
            "threshold": float(detector.get_threshold()),
            "fatigue": is_fatigued}