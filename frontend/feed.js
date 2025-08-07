// frontend/feed.js

const reportsContainer = document.getElementById("reportsContainer");
const logoutBtn = document.getElementById("logoutBtn");

const API_BASE = " https://exam-1-jmoj.onrender.com";

// Load all verified reports
async function loadReports() {
  try {
    const res = await fetch(`${API_BASE}/api/reports/verified`);
    const data = await res.json();

    if (Array.isArray(data)) {
      data.reverse().forEach((report) => {
        const div = document.createElement("div");
        div.className = "report-card";

        div.innerHTML = `
          <h3>${report.examName} — ${report.centerName}</h3>
          <p><strong>Description:</strong> ${report.description}</p>
          <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
          ${
            report.media
              ? `<img src="${API_BASE}/uploads/${report.media}" alt="evidence" />`
              : ""
          }
        `;
        reportsContainer.appendChild(div);
      });
    } else {
      reportsContainer.innerHTML = "<p>❌ Failed to load reports.</p>";
    }
  } catch (err) {
    console.error("Error fetching reports:", err);
    reportsContainer.innerHTML = "<p>❌ Network error. Please try again later.</p>";
  }
}

loadReports();

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "index.html";
});
