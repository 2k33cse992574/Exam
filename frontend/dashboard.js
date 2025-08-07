// frontend/dashboard.js

const reportsFeed = document.getElementById("reportsFeed");
const searchInput = document.getElementById("searchInput");
const tagFilter = document.getElementById("tagFilter");

const API_BASE = "https://exam-wsta.onrender.com/api/reports";

window.addEventListener("DOMContentLoaded", () => {
  // Restore filters from localStorage
  const savedSearch = localStorage.getItem("search");
  const savedTag = localStorage.getItem("tag");

  if (savedSearch) searchInput.value = savedSearch;
  if (savedTag) tagFilter.value = savedTag;

  fetchAndRenderReports();
});

// Save filters on change
searchInput.addEventListener("input", () => {
  localStorage.setItem("search", searchInput.value);
  fetchAndRenderReports();
});

tagFilter.addEventListener("change", () => {
  localStorage.setItem("tag", tagFilter.value);
  fetchAndRenderReports();
});

function clearFilters() {
  searchInput.value = "";
  tagFilter.value = "";
  localStorage.removeItem("search");
  localStorage.removeItem("tag");
  fetchAndRenderReports();
}

async function fetchAndRenderReports() {
  try {
    const res = await fetch(`${API_BASE}`);
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch");

    // Apply filters
    let filtered = data;

    const searchText = searchInput.value.toLowerCase();
    const selectedTag = tagFilter.value;

    if (searchText) {
      filtered = filtered.filter(
        (r) =>
          r.examName.toLowerCase().includes(searchText) ||
          r.centerName.toLowerCase().includes(searchText)
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((r) => r.tags && r.tags.includes(selectedTag));
    }

    renderReports(filtered);
  } catch (err) {
    reportsFeed.innerHTML = `<p style="color:red;">❌ Failed to load complaints.</p>`;
    console.error("Error:", err);
  }
}

function renderReports(reports) {
  if (!reports.length) {
    reportsFeed.innerHTML = `<p>No complaints found.</p>`;
    return;
  }

  const list = reports
    .reverse()
    .map(
      (r) => `
    <div class="report">
      <h3>${r.examName}</h3>
      <p><strong>Center:</strong> ${r.centerName}</p>
      <p>${r.description}</p>
      ${
        r.media
          ? `<img src="https://exam-wsta.onrender.com/uploads/${r.media}" alt="Proof" loading="lazy"/>`
          : ""
      }
      ${
        r.verified
          ? `<p class="verified">✅ Verified by Admin</p>`
          : `<p class="unverified">⚠️ Not yet verified</p>`
      }
    </div>`
    )
    .join("");

  reportsFeed.innerHTML = list;
}
