# 🎓 College ERP — Client

A full-featured **College Enterprise Resource Planning (ERP)** web application built with React.js. This is the frontend client for managing students, faculty, attendance, marks, timetables, and more — all in one place.

---

## 🚀 Live Demo

> https://college-erp-client-kappa.vercel.app/

---



---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React.js (Create React App)         |
| Routing     | React Router DOM                    |
| State Mgmt  | Redux / Context API                 |
| HTTP Client | Axios                               |
| Styling     | CSS / Tailwind CSS / Material UI    |
| Auth        | JWT (JSON Web Tokens)               |

---

## ✨ Features

- 🔐 **Role-based Authentication** — Admin, Faculty, and Student login
- 📊 **Dashboard** — Overview of key stats and recent activity
- 👨‍🎓 **Student Management** — Add, view, update student profiles
- 👨‍🏫 **Faculty Management** — Manage faculty records and assignments
- 📅 **Attendance Tracking** — Mark and view attendance by subject/class
- 📝 **Marks & Results** — Enter and view exam marks per subject
- 🗓️ **Timetable** — Class schedule management
- 📢 **Notices / Announcements** — Post and view college notices
- 🏫 **Department & Subject Management** — Organize academic structure

---

## 📁 Project Structure

```
college-ERP-client/
├── public/
│   └── index.html
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components (Dashboard, Login, etc.)
│   ├── redux/           # Redux store, actions, reducers
│   ├── api/             # Axios API calls
│   ├── utils/           # Helper functions
│   ├── App.js           # Root component with routes
│   └── index.js         # Entry point
├── .env.example
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- The backend server running → [college-ERP-server](https://github.com/gauravrajput4) *(link your backend repo)*

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gauravrajput4/college-ERP-client.git
   cd college-ERP-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 API Integration

This client connects to the **College ERP REST API** backend.

Base URL (development): `http://localhost:5000/api`

Key endpoints used:

```
POST   /auth/login             → User login
GET    /students               → Fetch all students
POST   /attendance/mark        → Mark attendance
GET    /marks/:studentId       → Get student marks
GET    /timetable/:classId     → Get class timetable
```

---

## 🧪 Available Scripts

```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject CRA config (irreversible)
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```
The `build/` folder contains the optimized production-ready app.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
Drag and drop the `build/` folder to [Netlify](https://netlify.com), or connect your GitHub repo.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🐛 Known Issues / Future Improvements

- [ ] Add mobile responsive design
- [ ] Implement real-time notifications (Socket.io)
- [ ] Add dark mode support
- [ ] Write unit tests (Jest + React Testing Library)
- [ ] Add fee management module
- [ ] Student result PDF download

---

## 👤 Author

**Gaurav Rajput**

- GitHub: [@gauravrajput4](https://github.com/gauravrajput4)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub — it means a lot!
