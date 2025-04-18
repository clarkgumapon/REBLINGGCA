"""
Run script for Niel's Fitness Gym Management System API
This script starts the FastAPI server
"""

import uvicorn
import sys
import os
from pathlib import Path

# Add parent directory to sys.path
parent_dir = str(Path(__file__).parent.parent)
sys.path.append(parent_dir)

from backend.utils.database_init import init_db

if __name__ == "__main__":
    # Initialize database with seed data
    init_db()
    
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 8000))
    
    # Start the server
    uvicorn.run(
        "backend.main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,
        reload_dirs=[os.path.join(parent_dir, "backend")]
    ) 