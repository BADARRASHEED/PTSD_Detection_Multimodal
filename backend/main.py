from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import *
from crud import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

# New API for fetching all doctors
@app.get("/doctors")
async def get_all_doctors_api(db: Session = Depends(get_db)):
    db_docs = get_all_doctors(db)
    return db_docs

@app.post("/doctor/login")
async def login_doctor(doc: DoctorLogin, db: Session = Depends(get_db)):
    db_doc = db.query(Doctor).filter(Doctor.doc_username == doc.doc_username, Doctor.doc_password == doc.doc_password).first()
    
    if not db_doc:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    return {"message": "Login successful", "doctor_id": db_doc.doc_id, "username": db_doc.doc_username}
