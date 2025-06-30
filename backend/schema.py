from pydantic import BaseModel

class DoctorCreate(BaseModel):
    doc_name: str
    doc_speciality: str
    doc_email: str
    doc_username: str
    doc_phone: str
    doc_password: str

class DoctorLogin(BaseModel):
    doc_username: str
    doc_password: str
