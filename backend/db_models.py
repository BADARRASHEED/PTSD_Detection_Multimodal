from sqlalchemy import Column, Integer, String
from database import Base

class Doctor(Base):
    __tablename__ = "doctors"
    doc_id = Column(Integer, primary_key=True, index=True)
    doc_name = Column(String, index=True)
    doc_email = Column(String, index=True)
    doc_speciality = Column(String, index=True)
    doc_username = Column(String, index=True)
    doc_phone = Column(String, index=True)
    doc_password = Column(String, index=True)
