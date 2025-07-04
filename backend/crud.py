from sqlalchemy.orm import Session
from db_models import Doctor
from schema import DoctorCreate
from fastapi import HTTPException


def create_doc(db: Session, doc: DoctorCreate):
    # Check if doctor with same email or username already exists
    existing = (
        db.query(Doctor)
        .filter(
            (Doctor.doc_email == doc.doc_email)
            | (Doctor.doc_username == doc.doc_username)
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Doctor with given email or username already exists",
        )

    db_doc = Doctor(
        doc_name=doc.doc_name,
        doc_speciality=doc.doc_speciality,
        doc_email=doc.doc_email,
        doc_username=doc.doc_username,
        doc_phone=doc.doc_phone,
        doc_password=doc.doc_password,
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc


def read_doc(db: Session, doc_id: int):
    return db.query(Doctor).filter(Doctor.doc_id == doc_id).first()


def update_doc(db: Session, doc_id: int, doc: DoctorCreate):
    db_doc = db.query(Doctor).filter(Doctor.doc_id == doc_id).first()

    if not db_doc:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Ensure new email/username do not belong to another doctor
    existing_email = (
        db.query(Doctor)
        .filter(Doctor.doc_email == doc.doc_email, Doctor.doc_id != doc_id)
        .first()
    )
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already in use")

    existing_username = (
        db.query(Doctor)
        .filter(Doctor.doc_username == doc.doc_username, Doctor.doc_id != doc_id)
        .first()
    )
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already in use")

    db_doc.doc_name = doc.doc_name
    db_doc.doc_speciality = doc.doc_speciality
    db_doc.doc_email = doc.doc_email
    db_doc.doc_username = doc.doc_username
    db_doc.doc_phone = doc.doc_phone
    db_doc.doc_password = doc.doc_password

    db.commit()
    db.refresh(db_doc)
    return db_doc


def delete_doc(db: Session, doc_id: int):
    db_doc = db.query(Doctor).filter(Doctor.doc_id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    db.delete(db_doc)
    db.commit()
    return db_doc


def get_all_doctors(db: Session):
    return db.query(Doctor).all()
