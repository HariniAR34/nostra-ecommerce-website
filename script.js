const searchInput = document.getElementById("searchInput");
const categoryFilterWrap = document.getElementById("categoryFilters");
const productCards = Array.from(document.querySelectorAll(".product-card"));
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const contactForm = document.getElementById("contactForm");

let activeCategory = "all";

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function updateProducts() {
  const query = searchInput ? normalizeText(searchInput.value) : "";
  const queryTokens = query ? query.split(" ") : [];

  let visibleProducts = 0;

  productCards.forEach((card) => {
    const productName = normalizeText(card.dataset.name || "");
    const productCategory = normalizeText(card.dataset.category || "");
    const searchableText = normalizeText(card.textContent || "");

    const matchesSearch =
      queryTokens.length === 0 ||
      queryTokens.every((token) =>
        productName.includes(token) ||
        productCategory.includes(token) ||
        searchableText.includes(token)
      );
    const matchesCategory = activeCategory === "all" || productCategory === activeCategory;

    const isVisible = matchesSearch && matchesCategory;
    card.hidden = !isVisible;

    if (isVisible) {
      visibleProducts += 1;
    }
  });

  if (resultCount) {
    resultCount.textContent = String(visibleProducts);
  }

  if (emptyState) {
    emptyState.style.display = visibleProducts === 0 ? "block" : "none";
  }
}

if (searchInput) {
  searchInput.addEventListener("input", updateProducts);
}

if (categoryFilterWrap) {
  categoryFilterWrap.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const chip = target.closest(".chip");
    if (!(chip instanceof HTMLButtonElement)) {
      return;
    }

    activeCategory = chip.dataset.category || "all";

    categoryFilterWrap.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("active", chip === target.closest(".chip"));
    });

    updateProducts();
  });
}

updateProducts();

if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    window.alert("Thank you. Your message has been sent successfully.");
    contactForm.reset();
  });
}
