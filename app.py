from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Simple skill list to start (you can expand later)
SKILLS_DB = [
    "python", "java", "javascript", "html", "css", "sql", "react",
    "node.js", "flask", "django", "machine learning", "deep learning",
    "nlp", "data analysis", "excel", "git", "github", "aws", "docker",
    "communication", "problem solving"
]

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9+.# ]", " ", text)
    return text

def extract_skills(text, skills_db):
    text = clean_text(text)
    found = set()

    for skill in skills_db:
        # Match complete phrase/word
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text):
            found.add(skill)

    return sorted(found)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    resume_text = data.get("resume_text", "")
    job_text = data.get("job_text", "")

    if not resume_text.strip() or not job_text.strip():
        return jsonify({"error": "Both resume_text and job_text are required"}), 400

    resume_skills = extract_skills(resume_text, SKILLS_DB)
    job_skills = extract_skills(job_text, SKILLS_DB)

    missing_skills = sorted(list(set(job_skills) - set(resume_skills)))
    matched_skills = sorted(list(set(job_skills).intersection(set(resume_skills))))

    match_score = 0
    if len(job_skills) > 0:
        match_score = round((len(matched_skills) / len(job_skills)) * 100, 2)

    return jsonify({
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "missing_skills": missing_skills,
        "matched_skills": matched_skills,
        "match_score": match_score
    })

if __name__ == "__main__":
    app.run(debug=True)