# Niel's Fitness Gym Management System Backend

This is the backend API for Niel's Fitness Gym Management System, built with Python, FastAPI, and SQLite.

## Features

- User management (admin, staff, members)
- Profile management
- Membership plans and subscriptions
- Payment processing and verification
- Attendance tracking
- Access control based on user roles
- JWT authentication
- RESTful API

## Tech Stack

- **Python 3.8+** - Programming language
- **FastAPI** - Modern web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight, file-based database
- **Pydantic** - Data validation and settings management
- **JWT** - Token-based authentication

## Setup

### Prerequisites

- Python 3.8 or higher

### Installation

1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment:
```
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

## Running the Server

1. Run the application:
```
python run.py
```

2. The API will be available at http://localhost:8000
3. API documentation will be available at http://localhost:8000/docs

## API Documentation

The API documentation is automatically generated using Swagger UI. After starting the server, you can visit the docs at http://localhost:8000/docs.

## Default Users

The database is initialized with the following users:

1. Admin User
   - Username: admin
   - Password: admin123
   - Role: admin

2. Staff User
   - Username: staff
   - Password: staff123
   - Role: staff

3. Member User
   - Username: member
   - Password: member123
   - Role: member

## Project Structure

```
backend/
├── config/             # Configuration files
├── controllers/        # Business logic
├── models/             # Database models
├── routes/             # API routes
├── schemas/            # Pydantic schemas for request/response validation
├── utils/              # Utility functions
├── main.py             # Application entry point
├── run.py              # Script to run the server
└── requirements.txt    # Dependencies
```

## Adding New Features

To add new features:

1. Create or update models in `models/`
2. Create or update Pydantic schemas in `schemas/`
3. Add business logic in `controllers/`
4. Create API endpoints in `routes/`
5. Register routes in `main.py` 