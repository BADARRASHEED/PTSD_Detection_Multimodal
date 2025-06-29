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

4. **Run the frontend tests:**
   ```bash
   npm test
   ```

## Backend

The backend is built with **FastAPI** and **SQLAlchemy**, which manages the logic of user authentication, doctor data, and integrates with the machine learning models for PTSD detection. All backend dependencies are Python-based, so Node.js is not required.

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

   After installation, verify that the command is available:
   ```bash
   ffmpeg -version
   ```

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

## Temporary Data Handling

During prediction, the `process_video` function writes intermediate files to
`temp/audio`, `temp/frames`, `temp/spectrogram_patches`, and `temp/transcripts`.
At the start of each run these directories are deleted with
`shutil.rmtree(..., ignore_errors=True)` and then recreated using
`os.makedirs` to ensure a clean workspace.

## Required Model Files

Before running the backend you must provide the pretrained model weights used by
the predictor. Place the following files inside the `backend/checkpoints/`
directory (or adjust the paths defined in
`backend/models/predictor.py` if you store them elsewhere):

* `best_tublett_embedding_model.pth`
* `best_effnet_vit_ensemble.pth`
* `ensemble_model.pth`
* `best_fusion_model.pth`

These files are not included in the repository due to their size. Obtain them
from the project authors or the original release location and download them
before starting the backend service.
