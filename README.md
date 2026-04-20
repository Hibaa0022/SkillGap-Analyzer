# Skill Gap Analyzer

A web-based **Skill Gap Analyzer** that compares a user's resume skills with a target job description and returns:

- ✅ Matched skills  
- ❌ Missing skills  
- 📊 Skill match percentage  
- 💡 Suggestions for improvement

This project is useful for students, job seekers, and career switchers to understand where they need to upskill.

---

## 📁 Project Structure

```bash
skill-gap-analyzer/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── assets/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .venv/              # local virtual environment (should NOT be pushed)
├── README.md
└── .gitignore
```

---

## 🚀 Features

- Resume text input
- Job description text input
- Skill extraction from both inputs
- Skill comparison engine
- Match score calculation
- User-friendly frontend interface

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (Flask)
- **Version Control:** Git & GitHub
- **Deployment:** Vercel (frontend) + backend API hosting

---

## ⚙️ Local Setup

### 1) Clone the repository

```bash
git clone https://github.com/Hibaa0022/<your-repo-name>.git
cd <your-repo-name>
```

### 2) Backend setup

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

- **Windows**
```bash
.venv\Scripts\activate
```

- **Mac/Linux**
```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
python app.py
```

### 3) Frontend setup

Open `frontend/index.html` directly in browser  
**or** run with Live Server in VS Code.

---

## 🧪 Example Test Data

### Resume Skills
`React, JavaScript, SQL, Node.js, Git`

### Job Description Skills
`React, TypeScript, Node.js, Docker, PostgreSQL, Git`

### Sample Output
- Matched: React, Node.js, Git  
- Missing: TypeScript, Docker, PostgreSQL  
- Match Score: 50%

---

## 🌐 Deployment Notes

- Frontend can be deployed on **Vercel**.
- Backend should be deployed separately (Render / Railway / Python hosting).
- Connect frontend API URL to hosted backend URL.

---

## ⚠️ Important (.venv)

Do **not** upload `.venv` to GitHub.  
It is machine-specific and very large.

Add this in `.gitignore`:

```gitignore
.venv/
venv/
__pycache__/
*.pyc
.env
```

If already pushed, remove it from tracking:

```bash
git rm -r --cached .venv
git commit -m "Remove .venv from repository"
git push
```

---

## 🔮 Future Improvements

- Upload resume as PDF/DOCX
- Better NLP-based skill extraction
- Skill synonym mapping (e.g., JS = JavaScript)
- Weighted scoring (required vs preferred skills)
- Downloadable skill gap report

---

## 👩‍💻 Author

**Hibaa0022**  
GitHub: [https://github.com/Hibaa0022](https://github.com/Hibaa0022)

---

## 📄 License

This project is licensed under the MIT License.
