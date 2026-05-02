# AURELIA - Luxury Fashion E-commerce

A sophisticated, minimalist luxury fashion e-commerce web application featuring an editorial design and a Python-powered AI Concierge.

## Features
- **Editorial Design Aesthetic:** Custom-built with a minimalist color palette (Obsidian, Champagne Gold, Pure White) and glassmorphism elements.
- **Dynamic Cart Management:** Global state management utilizing `localStorage` with a seamless slide-out drawer UI.
- **AI Concierge:** Built-in floating chat interface powered by a Python backend to handle intelligent keyword-based customer inquiries.
- **Secure Checkout Simulation:** A dedicated checkout workflow that processes cart data and simulates a secure payment environment.
- **Responsive Animations:** "Fade-in" entry animations driven by the browser's `IntersectionObserver` API for a premium feel.

##  Technology Stack
- **Frontend:** HTML5, Vanilla CSS3 (Custom Variables, Animations), JavaScript (Fetch API, DOM Manipulation)
- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic

##  How to Run Locally

To experience the AURELIA website locally, you need to run both the backend API and the frontend web server.

### 1. Start the Backend (FastAPI)
Open a terminal and navigate to the backend directory:
```bash
cd backend
```
Install the required dependencies:
```bash
pip install -r requirements.txt
```
Start the Uvicorn server:
```bash
uvicorn main:app --reload
```
*The backend will run on `http://localhost:8000`.*

### 2. Start the Frontend 
Open a **new, separate terminal** and navigate to the frontend directory:
```bash
cd frontend
```
Start a local HTTP server:
```bash
python -m http.server 8080
```

### 3. View the Site
Open your browser and navigate to:
**http://localhost:8080**
