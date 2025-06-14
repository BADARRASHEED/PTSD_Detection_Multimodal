# PTSD Detection System

This project is a PTSD detection system that utilizes machine learning models to analyze videos and detect signs of PTSD based on visual and audio cues. The system is structured into two main parts: **Frontend** and **Backend**.

## Frontend

The frontend is built using **Next.js** and provides the interface for doctors and administrators to interact with the system. 

### Setup Frontend

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_name>/frontend

2. **Install dependencies:**
    npm install

3. **Run the development server:**
    npm run dev


## Backend

The backend is built with **FastAPI** and **SQLAlchemy**, which manages the logic of user authentication, doctor data, and integrates with the machine learning models for PTSD detection.


1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_name>/backend

2. **Install dependencies:**

    ```bash
    pip install -r requirements.txt

3. **Run the development server:**

    ```bash
    uvicorn main:app --reload

## Set up the database

The backend relies on a PostgreSQL database. After installing PostgreSQL, create
a database named `doctor_db` (or adjust the name in `backend/database.py`).

1. Open a terminal with access to the `psql` command. On Windows you might run:

    ```bash
    cd "C:\Program Files\PostgreSQL\15\bin"
    psql -U postgres
    ```

2. Create the database inside `psql`:

    ```sql
    CREATE DATABASE doctor_db;
    ```

3. Exit `psql` with `\q`.

4. Ensure the connection string in `backend/database.py` matches your setup.
   Example:

    ```python
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:<password>@localhost:5432/doctor_db"
    ```

When the backend starts for the first time it will automatically create the
required tables.
