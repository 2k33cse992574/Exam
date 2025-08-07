// frontend/admin.js

const reportsContainer = document.getElementById("reportsContainer");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
});

async function fetchUnverifiedReports() {
  try {
    const res = await fetch("https://exam-wsta.onrender.com/api/reports/unverified", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Unauthorized or error fetching reports");
    }

    const reports = await res.json();
    displayReports(reports);
  } catch (err) {
    alert("❌ You are not authorized. Redirecting to login.");
    window.location.href = "login.html";
  }
}

function displayReports(reports) {
  reportsContainer.innerHTML = "";

  if (reports.length === 0) {
    reportsContainer.innerHTML = "<p>No unverified reports found ✅</p>";
    return;
  }

  reports.forEach((report) => {
    const card = document.createElement("div");
    card.className = "report-card";

    card.innerHTML = `
      <h3>${report.examName}</h3>
      <p><strong>Center:</strong> ${report.centerName}</p>
      <p>${report.description}</p>
      ${report.media ? `<img src="https://exam-wsta.onrender.com/uploads/${report.media}" alt="Evidence" width="100">` : ""}
      <p><strong>Submitted by:</strong> ${report.ip}</p>
      <button class="verifyBtn" data-id="${report._id}">✅ Verify</button>
      <button class="rejectBtn" data-id="${report._id}">❌ Reject</button>
    `;

    reportsContainer.appendChild(card);
  });

  attachActionListeners();
}

function attachActionListeners() {
  document.querySelectorAll(".verifyBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await verifyReport(id);
    });
  });

  document.querySelectorAll(".rejectBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await rejectReport(id);
    });
  });
}

async function verifyReport(id) {
  try {
    const res = await fetch(`https://exam-wsta.onrender.com/api/reports/verify/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (res.ok) {
      alert("✅ Report verified");
      fetchUnverifiedReports();
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to verify report");
  }
}

async function rejectReport(id) {
  try {
    const res = await fetch(`https://exam-wsta.onrender.com/api/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (res.ok) {
      alert("❌ Report rejected and deleted");
      fetchUnverifiedReports();
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to reject report");
  }
}

fetchUnverifiedReports();
