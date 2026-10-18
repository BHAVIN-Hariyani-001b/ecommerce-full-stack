# Ecommerce Full Stack

A full-stack ecommerce application built with Flask and React/Vite. The project includes customer-facing shopping flows, user authentication, cart and wishlist features, product reviews, order management, payments, and an admin interface.

## Tech Stack

- Frontend: React 19, Vite, Redux Toolkit, Material UI, PrimeReact, React Router
- Backend: Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Migrate
- Database: MySQL / SQLAlchemy-compatible database via environment variable
- Payment: Razorpay
- Mail: Flask-Mail
- File uploads: Product and invoice image handling

## Project Structure

```text
Ecommerce/
├── backend/
│   ├── app/
│   ├── migrations/
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── package.json
├── README.md
└── .gitignore
```

## Features

- User registration and login
- Google authentication support
- JWT-based authentication
- Product catalog and search
- Category and brand browsing
- Wishlist and cart management
- Reviews and ratings
- Order creation and tracking
- Payment integration with Razorpay
- Invoice generation
- Admin dashboard and product management

## Prerequisites

Before running the project, make sure you have installed:

- Python 3.10+
- Node.js 18+
- npm
- MySQL database server
- Git

## Backend Setup

1. Open a terminal in the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file inside the `backend` folder with required variables:

```env
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
DATA_URL=mysql+pymysql://username:password@localhost:3306/ecommerce_db
MAIL_USER_NAME=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
```

5. Initialize the database and run migrations if needed:

```bash
flask db upgrade
```

6. Start the Flask backend:

```bash
python run.py
```

The backend usually runs on:

```text
http://localhost:5000
```

## Frontend Setup

1. Open a terminal in the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```

## Useful Scripts

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

Backend:

```bash
python run.py
```

## Notes

- The backend reads environment variables through `backend/app/config.py`.
- The app expects a MySQL connection string via `DATA_URL`.
- For Gmail mail delivery, use an App Password rather than your normal Gmail password.
- For Google login, configure `GOOGLE_CLIENT_ID` in the backend environment and ensure the frontend Google OAuth setup matches it.

## License

This project is provided as-is for educational or development purposes unless otherwise specified in a license file.

## Author

Built as a full-stack ecommerce application for managing products, orders, and customer shopping flows.
