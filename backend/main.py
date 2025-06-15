from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil

from database import *
from crud import *
from schema import DoctorLogin
from ml.pipeline import process_video  # ✅ ADD THIS

app = FastAPI()

# === CORS (Frontend ↔ Backend) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Setup DB ===
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# === CRUD Endpoints for Doctors ===
@app.post("/doctor/create")
async def create_doc_api(doc: DoctorCreate, db: Session = Depends(get_db)):
    return create_doc(db, doc)


@app.get("/doctors/{doc_id}")
async def read_doc_api(doc_id: int, db: Session = Depends(get_db)):
    db_doc = read_doc(db, doc_id)
    if db_doc is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return db_doc


@app.post("/doctor/update")
async def update_doc_api(doc_id: int, doc: DoctorCreate, db: Session = Depends(get_db)):
    db_doc = update_doc(db, doc_id, doc)
    return db_doc


@app.post("/doctor/delete")
async def delete_doc_api(doc_id: int, db: Session = Depends(get_db)):
    db_doc = delete_doc(db, doc_id)
    if db_doc is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"message": "Doctor deleted successfully"}


@app.get("/doctors")
async def get_all_doctors_api(db: Session = Depends(get_db)):
    return get_all_doctors(db)


@app.post("/doctor/login")
async def login_doctor(doc: DoctorLogin, db: Session = Depends(get_db)):
    db_doc = (
        db.query(Doctor)
        .filter(
            Doctor.doc_username == doc.doc_username,
            Doctor.doc_password == doc.doc_password,
        )
        .first()
    )

    if not db_doc:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "message": "Login successful",
        "doctor_id": db_doc.doc_id,
        "username": db_doc.doc_username,
    }


# === NEW: Multimodal PTSD Prediction ===
@app.post("/predict")
async def predict_ptsd(video: UploadFile = File(...)):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    video_path = os.path.join(temp_dir, video.filename)

    # Directories created during processing
    subdirs = [
        os.path.join(temp_dir, "audio"),
        os.path.join(temp_dir, "frames"),
        os.path.join(temp_dir, "spectrogram_patches"),
        os.path.join(temp_dir, "transcripts"),
    ]

    try:
        # Save uploaded video to temp directory
        with open(video_path, "wb") as f:
            shutil.copyfileobj(video.file, f)

        # Run full pipeline → returns "PTSD" or "NO PTSD"
        result = process_video(video_path)

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Remove uploaded video and intermediate folders
        if os.path.exists(video_path):
            os.remove(video_path)
        for d in subdirs:
            shutil.rmtree(d, ignore_errors=True)


"""

To run the FastAPI server, use the command:

uvicorn main:app --reload

"""
