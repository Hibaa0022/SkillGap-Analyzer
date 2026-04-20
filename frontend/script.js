const analyzeBtn = document.getElementById("analyzeBtn");
const resumeText = document.getElementById("resumeText");
const jobText = document.getElementById("jobText");

const resumeWords = document.getElementById("resumeWords");
const jobWords = document.getElementById("jobWords");
const jobWordsLarge = document.getElementById("jobWordsLarge");
const resumeStatusTxt = document.getElementById("resumeStatusTxt");
const jobStatusTxt = document.getElementById("jobStatusTxt");
const resumeStatusDot = document.getElementById("resumeStatusDot");
const jobStatusDot = document.getElementById("jobStatusDot");

const resultDiv = document.getElementById("result");
const matchScoreEl = document.getElementById("matchScore");
const matchedSkillsEl = document.getElementById("matchedSkills");
const missingSkillsEl = document.getElementById("missingSkills");

const resumeTagsEl = document.getElementById("resumeTags");
const jobTagsEl = document.getElementById("jobTags");

const saveResumeBtn = document.getElementById("saveResumeBtn");
const clearResumeBtn = document.getElementById("clearResumeBtn");
const clearJobBtn = document.getElementById("clearJobBtn");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const navButtons = document.querySelectorAll(".nav-btn");
const panels = document.querySelectorAll(".panel");

const savedList = document.getElementById("savedList");
const scoreBar = document.getElementById("scoreBar");
const missingChart = document.getElementById("missingChart");

const STORAGE = {
  SAVED_RESUMES: "sga_saved_resumes",
  REPORTS: "sga_gap_reports"
};

const skillDictionary = [
  "python","java","javascript","html","css","sql","react","node.js",
  "flask","django","machine learning","deep learning","nlp","data analysis",
  "excel","git","github","aws","docker","communication","problem solving",
  "network security","siem","soc","incident response","vulnerability assessment",
  "penetration testing","firewall","ids","ips","zero trust","iso 27001","nist"
];

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+.# ]/g, " ");
}

function detectSkills(text) {
  const clean = normalize(text);
  const found = [];
  for (const skill of skillDictionary) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(clean)) found.push(skill);
  }
  return [...new Set(found)].sort();
}

function setDot(dot, type) {
  dot.classList.remove("red", "amber", "green");
  dot.classList.add(type);
}

function renderTagHint(el, tags) {
  if (!tags.length) {
    el.textContent = "No keywords detected yet";
    return;
  }
  el.textContent = `Keywords: ${tags.slice(0, 8).join(", ")}`;
}

function updateLiveStats() {
  const rText = resumeText.value;
  const jText = jobText.value;
  const rCount = wordCount(rText);
  const jCount = wordCount(jText);

  resumeWords.textContent = rCount;
  jobWords.textContent = jCount;
  jobWordsLarge.textContent = jCount;

  if (rCount === 0) {
    resumeStatusTxt.textContent = "Empty";
    setDot(resumeStatusDot, "red");
  } else if (rCount < 100) {
    resumeStatusTxt.textContent = "Analyzing";
    setDot(resumeStatusDot, "amber");
  } else {
    resumeStatusTxt.textContent = "Processed";
    setDot(resumeStatusDot, "green");
  }

  if (jCount === 0) {
    jobStatusTxt.textContent = "Empty";
    setDot(jobStatusDot, "red");
  } else if (jCount < 100) {
    jobStatusTxt.textContent = "Analyzing";
    setDot(jobStatusDot, "amber");
  } else {
    jobStatusTxt.textContent = "Processed";
    setDot(jobStatusDot, "green");
  }

  renderTagHint(resumeTagsEl, detectSkills(rText));
  renderTagHint(jobTagsEl, detectSkills(jText));
}

function createChip(text, type) {
  const span = document.createElement("span");
  span.className = `chip ${type}`;
  span.textContent = text;
  return span;
}

/* ---------- Navigation ---------- */
function switchPanel(panelId) {
  navButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.panel === panelId));
  panels.forEach(panel => panel.classList.toggle("active-panel", panel.id === panelId));
}
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchPanel(btn.dataset.panel);
    if (btn.dataset.panel === "savedPanel") renderSavedPanel();
    if (btn.dataset.panel === "reportsPanel") renderReportsPanel();
  });
});

/* ---------- LocalStorage ---------- */
function getSavedResumes() {
  return JSON.parse(localStorage.getItem(STORAGE.SAVED_RESUMES) || "[]");
}
function setSavedResumes(data) {
  localStorage.setItem(STORAGE.SAVED_RESUMES, JSON.stringify(data));
}
function getReports() {
  return JSON.parse(localStorage.getItem(STORAGE.REPORTS) || "[]");
}
function setReports(data) {
  localStorage.setItem(STORAGE.REPORTS, JSON.stringify(data));
}

/* ---------- Saved Panel ---------- */
function renderSavedPanel() {
  const saved = getSavedResumes();
  savedList.innerHTML = "";

  if (!saved.length) {
    savedList.innerHTML = `<p class="panel-sub">No saved resumes yet.</p>`;
    return;
  }

  saved.forEach(item => {
    const row = document.createElement("div");
    row.className = "entry-row";
    row.innerHTML = `
      <div>
        <div class="entry-title">${item.title}</div>
        <div class="entry-meta">${new Date(item.created_at).toLocaleString()}</div>
      </div>
      <div class="entry-actions">
        <button data-load="${item.id}">Load</button>
        <button data-del="${item.id}" class="danger">Delete</button>
      </div>
    `;
    savedList.appendChild(row);
  });
}

savedList.addEventListener("click", (e) => {
  const loadId = e.target.getAttribute("data-load");
  const delId = e.target.getAttribute("data-del");
  let saved = getSavedResumes();

  if (loadId) {
    const item = saved.find(x => x.id === loadId);
    if (!item) return;
    resumeText.value = item.resume_text;
    updateLiveStats();
    switchPanel("dashboardPanel");
  }

  if (delId) {
    saved = saved.filter(x => x.id !== delId);
    setSavedResumes(saved);
    renderSavedPanel();
  }
});

/* ---------- Reports Panel ---------- */
function renderReportsPanel() {
  const reports = getReports();

  if (!reports.length) {
    scoreBar.style.width = "0%";
    scoreBar.textContent = "0%";
    missingChart.innerHTML = `<p class="panel-sub">No reports yet. Run analysis first.</p>`;
    return;
  }

  const latest = reports[0];
  scoreBar.style.width = `${latest.match_score}%`;
  scoreBar.textContent = `${latest.match_score}%`;

  const freq = {};
  reports.forEach(r => {
    (r.missing_skills || []).forEach(skill => {
      freq[skill] = (freq[skill] || 0) + 1;
    });
  });

  const top = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,8);
  missingChart.innerHTML = "";
  if (!top.length) {
    missingChart.innerHTML = `<p class="panel-sub">No missing skills found in reports.</p>`;
    return;
  }

  const max = top[0][1];
  top.forEach(([skill, count]) => {
    const row = document.createElement("div");
    row.className = "mini-row";
    row.innerHTML = `
      <span>${skill}</span>
      <div class="mini-track"><div class="mini-fill" style="width:${(count/max)*100}%"></div></div>
      <b>${count}</b>
    `;
    missingChart.appendChild(row);
  });
}

/* ---------- Buttons ---------- */
saveResumeBtn.addEventListener("click", () => {
  const text = resumeText.value.trim();
  if (!text) return alert("Resume text is empty.");

  const saved = getSavedResumes();
  const item = {
    id: crypto.randomUUID(),
    title: `Resume ${saved.length + 1}`,
    resume_text: text,
    created_at: Date.now()
  };
  saved.unshift(item);
  setSavedResumes(saved.slice(0, 100));
  alert("Resume saved.");
});

clearResumeBtn.addEventListener("click", () => {
  resumeText.value = "";
  updateLiveStats();
});

clearJobBtn.addEventListener("click", () => {
  jobText.value = "";
  updateLiveStats();
});

resumeText.addEventListener("input", updateLiveStats);
jobText.addEventListener("input", updateLiveStats);

/* ---------- Analyze ---------- */
analyzeBtn.addEventListener("click", async () => {
  const resume = resumeText.value.trim();
  const job = jobText.value.trim();

  if (!resume || !job) {
    alert("Please fill both Resume and Job Description.");
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";
  progressText.textContent = "Analyzing...";
  progressFill.style.width = "45%";

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resume, job_text: job })
    });

    progressFill.style.width = "80%";
    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Something went wrong.");
      progressText.textContent = "Failed.";
      return;
    }

    matchScoreEl.textContent = `${data.match_score}%`;
    matchedSkillsEl.innerHTML = "";
    missingSkillsEl.innerHTML = "";

    data.matched_skills.forEach(s => matchedSkillsEl.appendChild(createChip(s, "match")));
    data.missing_skills.forEach(s => missingSkillsEl.appendChild(createChip(s, "missing")));

    // Save report history for graph panel
    const reports = getReports();
    reports.unshift({
      id: crypto.randomUUID(),
      match_score: data.match_score,
      missing_skills: data.missing_skills || [],
      matched_skills: data.matched_skills || [],
      created_at: Date.now()
    });
    setReports(reports.slice(0, 200));

    progressFill.style.width = "100%";
    progressText.textContent = "Completed.";
    resultDiv.classList.remove("hidden");
    resultDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (e) {
    alert("Cannot connect to backend. Ensure Flask is running on http://127.0.0.1:5000");
    progressText.textContent = "Connection error.";
    progressFill.style.width = "0%";
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Skills";
    updateLiveStats();
  }
});

/* Init */
updateLiveStats();
switchPanel("dashboardPanel");
