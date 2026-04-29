# ACITY CONNECT – Frontend

Smart Campus Marketplace Interface

---

## Project Overview

This frontend provides the user interface for ACITY CONNECT. It allows users to register, log in, manage profiles, create listings, and communicate with others.

---

## Tech Stack

* HTML
* CSS
* JavaScript

---

## Features

### Authentication

* Login page
* Registration page
* Token storage using localStorage

### Profile

* Update skills offered
* Update skills needed

### Listings

* View listings
* Create listings
* Display listing details
* “Interested” button

### Messaging

* Send messages to other users

---

## Project Structure

```bash
acity-connect-frontend/
│
├── index.html
├── register.html
├── dashboard.html
├── profile.html
├── chat.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── listings.js
│   ├── profile.js
│   └── chat.js
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/acity-connect-frontend.git
cd acity-connect-frontend
```

### 2. Connect to Backend

Open:
`js/api.js`

Set API URL:

```js
const API_URL = "http://localhost:5000/api";
```

For deployment:

```js
const API_URL = "https://your-backend.onrender.com/api";
```

---

### 3. Run Frontend

Option 1:
Open `index.html` in a browser

Option 2:
Use Live Server in VS Code

---

## Deployment

Frontend hosted on GitHub Pages
Add your live link here

---

## Test Credentials

Email: [test@acity.edu](mailto:test@acity.edu)
Password: 123456

---

## Notes

* Backend must be running for full functionality
* Ensure correct API URL
* Use browser console for debugging

---

## Author

Your Name

---

## License

Academic Project
