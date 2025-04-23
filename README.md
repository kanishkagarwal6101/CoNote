# CoNote – Collaborative Note App

CoNote is a full-stack collaborative note-taking application designed for real-time editing, secure authentication, and a clean, responsive UI. Users can create, edit, and delete notes—individually or collaboratively—with all changes synced live across clients.

---

## Features

### ✨ Core Functionality
- **User Authentication**  
  Secure signup/login using JWT tokens. Passwords are hashed with bcrypt.

- **Note Management (CRUD)**  
  Users can create, view, edit, and delete their own notes.

- **Real-Time Collaboration**  
  Multiple users can edit the same note simultaneously using WebSockets (Socket.IO).

- **Live Editing**  
  Text changes are broadcast instantly across all users viewing the same note.

- **Sharable Collaboration Links**  
  Authenticated users can share note links; collaborators are redirected to the correct note after login.

- **Who’s Editing Indicator**  
  See which users are currently editing a note in real-time.

- **Authentication-Gated Views**  
  Notes and dashboard are protected routes accessible only to logged-in users.

- **Deployed Backend on AWS EC2**  
  Node.js + MongoDB backend running on a cloud-hosted Ubuntu instance.

- **HTTPS Development Access via ngrok**  
  Local development is tunneled using ngrok for secure API communication with Vercel frontend.

### ✨ UI/UX
- Responsive layout built with **Tailwind CSS**
- Neo-brutalist note cards for visual character
- Smooth transitions and hover states
- Personalized dashboard showing user's notes and greeting

---

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS  
- **Backend**: Node.js, Express, MongoDB, Mongoose  
- **Authentication**: JWT, bcrypt  
- **Real-Time**: Socket.IO  
- **Cloud Hosting**: AWS EC2 (Ubuntu)  
- **Dev Tunnel**: ngrok  

---

## Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/conote.git
   cd conote

2. **Frontend**
   ```bash
    cd client
    npm install
    npm run dev

3. **Backend**
   ```bash
    cd backend
    npm install
    node server.js
    
## Future Work

 - Add note version history

 - Comments within notes

 - Offline support with local storage

 - Email-based invitation for collaboration

 - Markdown support

 - Dark mode toggle

 - Admin dashboard for managing users/notes

 