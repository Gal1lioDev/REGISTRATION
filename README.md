# DEFCON 2.0 — Terminal Registration Platform
> **A 4-Hour Attack–Defense Cyberwarfare Competition hosted at NIT Warangal**
> Tagline: `RECON | BREACH | EXPLOIT` — *"Some systems wait to be used. Ours wait to be broken."*

A full-stack, cybersecurity terminal-themed registration website for **DEFCON 2.0**. Participants interact with a simulated command terminal and must solve **exactly two CTF screening challenges** (Recon & Decode) to unlock server-authorized team enrollment.

---

## 🛡 Architecture Overview

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Pydantic-Settings.
- **Database**: PostgreSQL 16 (or SQLite for zero-setup local development), SQLAlchemy 2.0, Alembic migrations.
- **Authentication & Sessions**: Cryptographically random opaque tokens in HttpOnly, SameSite cookies (`defcon_session` and `defcon_admin_token`).
- **Containerization**: Docker multi-stage builds and Docker Compose orchestration.

---

## 🎯 The Two CTF Challenges

| # | Challenge | Difficulty | Intel / Clue | Expected Solution | Safe Simulation Command |
|---|---|---|---|---|---|
| **1** | **Recon** | Easy | Hidden in plain sight in `index.html` source: `<!-- DEFCON_INTEL: RECON -->` | `RECON` | `submit 1 RECON` |
| **2** | **Decode** | Easy | Intercepted Base64 payload: `QlJFQUNI` | `BREACH` | `echo QlJFQUNI \| base64 -d` |

- **Answer Validation**: Case-insensitive and trimmed server-side validation.
- **Rate Limiting**: Maximum 5 failed attempts per 60 seconds per session window (returns HTTP 429).
- **Session Persistence**: Progress is backed by database records and restored seamlessly on reload.
- **Gated Registration**: Calling the registration API without both completed challenges returns `403 Forbidden: ACCESS DENIED`.

---

## 💻 Terminal Commands

The terminal is a simulated, sandboxed React component using an explicit allowlist parser:

| Command | Action |
|---|---|
| `help` or `--help` | Display reference of all available system commands |
| `about` | Display competition rules, format, venue, and timing |
| `challenges` | Display the 2 challenges and their real-time completion status |
| `challenge 1` | Inspect Challenge 1 mission brief |
| `challenge 2` | Inspect Challenge 2 mission brief |
| `hint 1` | Reveal progressive hints for Challenge 1 |
| `hint 2` | Reveal progressive hints for Challenge 2 |
| `submit 1 <answer>` | Submit answer for Challenge 1 to backend API |
| `submit 2 <answer>` | Submit answer for Challenge 2 to backend API |
| `echo <b64> \| base64 -d` | Safe, client-side Base64 decode simulation |
| `status` | View real-time qualification progress (`0/2`, `1/2`, `2/2`) |
| `register` | Open the team enrollment protocol (unlocked at 2/2) |
| `clear` | Clear terminal output buffer |
| `admin` | Open administrative control dashboard |

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js** v20+ and **npm**
- **Python** 3.11+
- (Optional) **Docker** & **Docker Compose**

### 2. Environment Setup
Copy the example configuration file:
```bash
cp .env.example .env
```

### 3. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will be available at `http://127.0.0.1:8000`.
Interactive API Docs (Swagger): `http://127.0.0.1:8000/docs`

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend terminal will run at `http://127.0.0.1:5173`.

---

## 🧪 Automated Testing

The backend includes a comprehensive `pytest` test suite verifying health, session isolation, challenge validation, rate limiting, registration barriers, duplicate prevention, and admin security:

```bash
cd backend
.\.venv\Scripts\python.exe -m pytest -v
```

All 16 unit and integration tests execute against an isolated database fixture.

---

## 🐳 Docker & Production Deployment

To run the full stack with PostgreSQL, FastAPI backend, and Nginx reverse proxy:

```bash
# Build and launch containers
docker compose up --build -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

- **Frontend**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:8000`
- **PostgreSQL**: `localhost:5432`

---

## 🔐 Administrative Dashboard

- Access via the **[admin portal]** button in the footer or by typing `admin` in the terminal.
- **Default Username**: `admin`
- **Default Password**: `*********` (configure via `ADMIN_PASSWORD` in `.env`)
- **Capabilities**:
  - View total enrolled teams and participants breakdown (1 to 4 member squads).
  - Search teams by name, institution, leader email, or registration code.
  - View squad member rosters and contact info.
  - One-click **Export to CSV** for organizers.

---

## 📁 Directory Structure

```
├── backend/
│   ├── alembic/              # Database migration versions
│   ├── app/
│   │   ├── config.py         # Pydantic environment configuration
│   │   ├── database.py       # SQLAlchemy engine & session factory
│   │   ├── dependencies.py   # HttpOnly session & admin authentication
│   │   ├── models.py         # Database schema models
│   │   ├── rate_limiter.py   # Sliding window submission rate limiter
│   │   ├── schemas.py        # Pydantic v2 validation models
│   │   ├── security.py       # Password verification & signature tokens
│   │   └── routes/           # Modular API endpoints
│   ├── tests/                # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroBanner.tsx          # DEFCON ASCII banner matching reference
│   │   │   ├── Terminal.tsx            # Bounded simulated terminal component
│   │   │   ├── Sidebar.tsx             # Progress, event info, & lock status cards
│   │   │   ├── RegistrationModal.tsx   # Dynamic squad registration modal
│   │   │   ├── RegistrationSuccess.tsx # Confirmation & ID voucher screen
│   │   │   └── AdminDashboard.tsx      # Protected tournament admin portal
│   │   ├── services/api.ts   # API client with credentials include
│   │   └── types/index.ts    # TypeScript interfaces
│   ├── index.html            # Public HTML with deliberate intel comment
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
├── .env
└── README.md
```
