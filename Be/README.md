# Backend Project

This is the backend service for the graduation project, built with Flask, SQLAlchemy, and PostgreSQL.

## Prerequisites

- Python 3.8 or higher
- PostgreSQL database
- pip (Python package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Be
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1. Create a `.env` file in the root directory with the following variables:

   ```
   FLASK_APP=run.py
   FLASK_DEBUG=1
   SECRET_KEY=your_secret_key
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

   Replace `username`, `password`, and `database_name` with your PostgreSQL credentials.

## Database Setup

1. Initialize the database:

   ```bash
   flask db init
   ```

2. Create a migration:

   ```bash
   flask db migrate -m "Initial migration"
   ```

3. Apply the migration:
   ```bash
   flask db upgrade
   ```

## Running the Application

1. Start the Flask server:

   ```bash
   flask run
   ```

   The API will be available at http://localhost:5000/

## API Documentation

The API provides endpoints for:

- User management
- Authentication
- [Add more endpoints relevant to your project]

## Project Structure

```
Be/
├── app/
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── middleware/    # Request middleware
│   ├── __init__.py    # Application factory
│   └── config.py      # Configuration
├── migrations/        # Database migrations
├── .env               # Environment variables (not in git)
├── .gitignore         # Git ignore file
├── requirements.txt   # Project dependencies
└── run.py             # Application entry point
```

## Development

To make changes to the database schema:

1. Modify the models in `app/models/`
2. Create a new migration:
   ```bash
   flask db migrate -m "Description of changes"
   ```
3. Apply the migration:
   ```bash
   flask db upgrade
   ```
