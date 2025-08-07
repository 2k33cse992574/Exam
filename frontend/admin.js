const BACKEND_URL = "https://eduguard-backend.onrender.com"; // 🔁 Replace with your actual backend URL

async function fetchReports() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reports`);
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    displayReports(data);
    updateStats(data);
  } catch (error) {
    document.getElementById("adminContainer").innerText =
      "❌ Failed to load reports";
    console.error("Error fetching reports:", error.message);
  }
}

function displayReports(reports) {
  const container = document.getElementById("adminContainer");
  container.innerHTML = "";

  reports.forEach((report) => {
    const div = document.createElement("div");
    div.className = `report ${report.isVerified ? "verified" : ""}`;

    div.innerHTML = `
      <input type="checkbox" data-id="${report._id}" />
      <strong>${report.examName}</strong> — ${report.centerName}
      <p>${report.description}</p>
      ${report.media ? getMediaTag(report.media) : ""}
      <div>🕒 ${new Date(report.timestamp).toLocaleString()}</div>
      <div>📍 IP: ${report.ip}</div>
      <div>
        <button onclick="verifyReport('${report._id}')">✅ Verify</button>
        <button onclick="deleteReport('${report._id}')">🗑️ Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function getMediaTag(media) {
  const ext = media.split(".").pop().toLowerCase();
  const mediaURL = `${BACKEND_URL}/uploads/${media}`;
  return ext === "mp4"
    ? `<video controls src="${mediaURL}"></video>`
    : `<img src="${mediaURL}" alt="Uploaded media" />`;
}

async function verifyReport(id) {
  await fetch(`${BACKEND_URL}/api/reports/${id}/verify`, { method: "PUT" });
  fetchReports();
}

async function deleteReport(id) {
  await fetch(`${BACKEND_URL}/api/reports/${id}`, { method: "DELETE" });
  fetchReports();
}

async function verifySelectedReports() {
  const selected = document.querySelectorAll(
    "#adminContainer input[type='checkbox']:checked"
  );
  for (const box of selected) {
    await fetch(`${BACKEND_URL}/api/reports/${box.dataset.id}/verify`, {
      method: "PUT",
    });
  }
  fetchReports();
}

async function deleteSelectedReports() {
  const selected = document.querySelectorAll(
    "#adminContainer input[type='checkbox']:checked"
  );
  for (const box of selected) {
    await fetch(`${BACKEND_URL}/api/reports/${box.dataset.id}`, {
      method: "DELETE",
    });
  }
  fetchReports();
}

function updateStats(reports) {
  const total = reports.length;
  const verified = reports.filter((r) => r.isVerified).length;
  const pending = total - verified;
  document.getElementById(
    "adminStats"
  ).innerText = `📋 Total: ${total} | ✅ Verified: ${verified} | ❌ Pending: ${pending}`;
}

function filterReports(status) {
  const allReports = document.querySelectorAll(".report");
  allReports.forEach((r) => {
    const isVerified = r.classList.contains("verified");
    r.style.display =
      status === "all" ||
      (status === "verified" && isVerified) ||
      (status === "pending" && !isVerified)
        ? "block"
        : "none";
  });
}

function handleSearch(query) {
  const lower = query.toLowerCase();
  document.querySelectorAll(".report").forEach((r) => {
    r.style.display = r.innerText.toLowerCase().includes(lower)
      ? "block"
      : "none";
  });
}

function logout() {
  localStorage.removeItem("admin-auth");
  location.href = "/admin-login.html";
}

function downloadCSV() {
  const rows = [["Exam", "Center", "Description", "IP"]];
  document.querySelectorAll(".report").forEach((r) => {
    const text = r.innerText.split("\n");
    rows.push([text[1], text[2], text[3], text[text.length - 2]]);
  });

  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reports.csv";
  a.click();
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const reports = document.querySelectorAll(".report");

  reports.forEach((r, i) => {
    doc.text(r.innerText, 10, 10 + i * 40);
  });

  doc.save("reports.pdf");
}

// 🔁 Start
fetchReports();
