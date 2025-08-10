function getUniqueCategories(businesses) {
  const set = new Set(businesses.map((b) => b.category));
  return Array.from(set).sort();
}

function buildQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && String(v).trim().length > 0) usp.set(k, String(v).trim());
  });
  const query = usp.toString();
  return query ? `?${query}` : "";
}

function navigateToResults(params) {
  window.location.href = `./search.html${buildQuery(params)}`;
}

function renderCategories(container, categories) {
  container.innerHTML = "";
  categories.forEach((cat) => {
    const a = document.createElement("a");
    a.className = "category-chip";
    a.href = `./search.html?category=${encodeURIComponent(cat)}`;
    a.textContent = cat;
    container.appendChild(a);
  });
}

function matchesQuery(business, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [business.name, business.address, business.phone, business.category]
    .some((f) => (f || "").toLowerCase().includes(needle));
}

function matchesCategory(business, category) {
  if (!category) return true;
  return String(business.category).toLowerCase() === String(category).toLowerCase();
}

function filterBusinesses(businesses, { q, category }) {
  return businesses.filter((b) => matchesQuery(b, q) && matchesCategory(b, category));
}

function createBusinessCard(b) {
  const card = document.createElement("div");
  card.className = "business-card";
  card.innerHTML = `
    <h3>${b.name}</h3>
    <div class="business-meta">
      <span class="badge">${b.category}</span>
      <span>📍 ${b.address}</span>
      <span>☎️ <a href="tel:${b.phone.replace(/[^\d+]/g, "")}">${b.phone}</a></span>
    </div>
    <div class="card-actions">
      <a class="button secondary" href="https://www.google.com/maps/search/${encodeURIComponent(b.address)}" target="_blank" rel="noopener">Map</a>
      <a class="button secondary" href="tel:${b.phone.replace(/[^\d+]/g, "")}">Call</a>
    </div>
  `;
  return card;
}

function renderBusinessList(container, businesses) {
  container.innerHTML = "";
  if (!businesses.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No businesses found. Try a different search or category.";
    container.appendChild(empty);
    return;
  }
  const grid = document.createElement("div");
  grid.className = "grid";
  businesses.forEach((b) => grid.appendChild(createBusinessCard(b)));
  container.appendChild(grid);
}

function bindSearch(form) {
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const q = formData.get("q") || "";
    const category = formData.get("category") || "";
    navigateToResults({ q, category });
  });
}

function setActiveNav() {
  const pathname = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const isActive = a.getAttribute("href").endsWith(pathname);
    if (isActive) a.classList.add("active");
  });
}

// Page initializers
function initHomePage() {
  setActiveNav();
  const categories = getUniqueCategories(BUSINESSES);
  const catsEl = document.getElementById("categories");
  if (catsEl) renderCategories(catsEl, categories);
  bindSearch(document.getElementById("search-form"));
  // Populate category select
  const categorySelect = document.getElementById("category-select");
  if (categorySelect) {
    categorySelect.innerHTML = `<option value="">All categories</option>` +
      categories.map((c) => `<option value="${c}">${c}</option>`).join("");
  }
}

function initListingsPage() {
  setActiveNav();
  const listEl = document.getElementById("list");
  renderBusinessList(listEl, BUSINESSES);
}

function initSearchPage() {
  setActiveNav();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const results = filterBusinesses(BUSINESSES, { q, category });

  // Update header text
  const title = document.getElementById("results-title");
  const parts = [];
  if (q) parts.push(`“${q}”`);
  if (category) parts.push(`in ${category}`);
  title.textContent = parts.length ? `Results for ${parts.join(" ")}` : "All Results";

  // Pre-fill search fields if present
  const qInput = document.querySelector('input[name="q"]');
  if (qInput) qInput.value = q;
  const catSelect = document.getElementById("category-select");
  if (catSelect) {
    const categories = getUniqueCategories(BUSINESSES);
    catSelect.innerHTML = `<option value="">All categories</option>` +
      categories.map((c) => `<option value="${c}" ${c.toLowerCase()===category.toLowerCase()?"selected":""}>${c}</option>`).join("");
  }

  renderBusinessList(document.getElementById("results"), results);
  bindSearch(document.getElementById("search-form"));
}