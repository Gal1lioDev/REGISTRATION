from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import engine, Base
from app.routes import health, session, challenges, registration, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[!] Warning: Could not auto-create database tables on startup: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="DEFCON 2.0 Terminal Cybersecurity Competition Registration Platform",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Prevent leaking sensitive stack traces or database errors in production
    if settings.DEBUG:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal Server Error: {str(exc)}"},
        )
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred. Please try again."},
    )


# Include Routers
app.include_router(health.router)
app.include_router(session.router)
app.include_router(challenges.router)
app.include_router(registration.router)
app.include_router(admin.router)
