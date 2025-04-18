from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from backend.config.database import engine, Base
from backend.routes import auth_router, users_router, memberships_router, payments_router, attendance_router
from backend.models import User, Profile, MembershipPlan, Subscription, Payment, Attendance

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Niel's Fitness Gym API",
    description="API for Niel's Fitness Gym Management System",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost",
    "*"  # Allow all origins in development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(memberships_router)
app.include_router(payments_router)
app.include_router(attendance_router)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Niel's Fitness Gym API is running"}

if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 8000))
    # Start the server
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True) 