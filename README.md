# PTSD Detection System

This project is a PTSD detection system that utilizes machine learning models to analyze videos and detect signs of PTSD based on visual and audio cues. The system is structured into two main parts: **Frontend** and **Backend**.

## Frontend

The frontend is built using **Next.js** and provides the interface for doctors and administrators to interact with the system. 

### Setup Frontend

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <repository_name>/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Backend

The backend is built with **FastAPI** and **SQLAlchemy**, which manages the logic of user authentication, doctor data, and integrates with the machine learning models for PTSD detection.

### Setup Backend

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <repository_name>/backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install FFmpeg:** Ensure FFmpeg is installed and accessible in your `PATH`.
   - **Linux:** `apt-get install ffmpeg`
   - **macOS:** `brew install ffmpeg`
   - **Windows:** [Download from the official site](https://ffmpeg.org/download.html) or `choco install ffmpeg`

4. **Run the development server:**
   ```bash
   uvicorn main:app --reload
   ```

## Set up the Database

The backend relies on a PostgreSQL database. After installing PostgreSQL, create a database named `doctor_db` (or adjust the name in your `DATABASE_URL` variable).

1. Open a terminal with access to the `psql` command. On Windows you might run:
   ```bash
   cd "C:\Program Files\PostgreSQL\15\bin"
   psql -U postgres
   ```

2. Create the database inside `psql`:
   ```sql
   CREATE DATABASE doctor_db;
   ```

3. Exit `psql` with:
   ```bash
   \q
   ```

4. (Optional) You can also connect directly to verify:
   ```bash
   psql -U postgres -d doctor_db
   ```

5. Configure the database connection string by setting the
   `DATABASE_URL` environment variable:
   ```bash
   export DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/doctor_db"
   ```

When the backend starts for the first time, it will automatically create the required tables.
