// Bizntech Social Help Center Application Logic
(function() {
  const kb = window.KNOWLEDGE_BASE;
  if (!kb) {
    console.error("Knowledge base not loaded!");
    return;
  }

  // State
  let currentSearchQuery = "";

  // Elements
  const collectionsView = document.getElementById("collections-view");
  const categoryView = document.getElementById("category-view");
  const articleView = document.getElementById("article-view");
  const searchResultsView = document.getElementById("search-results-view");
  
  const collectionsGrid = document.getElementById("collections-grid");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const searchResultsList = document.getElementById("results-list");
  const searchCountBadge = document.getElementById("search-count-badge");
  
  const categoryTitle = document.getElementById("category-title");
  const categoryDesc = document.getElementById("category-desc");
  const categoryArticlesGrid = document.getElementById("category-articles-grid");
  
  const articleTitle = document.getElementById("article-title");
  const articleDesc = document.getElementById("article-desc");
  const articleBreadcrumbCat = document.getElementById("article-breadcrumb-cat");
  const articleBody = document.getElementById("article-body");
  const relatedArticlesList = document.getElementById("related-articles-list");

  // Icon mapping for collections
  function getCollectionIcon(slug) {
    if (slug.includes("getting-started") || slug.includes("learn")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`;
    } else if (slug.includes("integration")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>`;
    } else if (slug.includes("ai") || slug.includes("playground")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`;
    } else if (slug.includes("calendar")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
    } else if (slug.includes("marketing") || slug.includes("course")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`;
    } else if (slug.includes("media")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
    } else if (slug.includes("troubleshooting") || slug.includes("accessibility")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`;
    } else if (slug.includes("billing") || slug.includes("customer")) {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`;
    } else {
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`;
    }
  }

  // Render Collection Cards on Home
  function renderCollections() {
    collectionsGrid.innerHTML = "";
    
    // Calculate article counts per collection
    const counts = {};
    kb.Articles.forEach(a => {
      counts[a.CategorySlug] = (counts[a.CategorySlug] || 0) + 1;
    });

    kb.Collections.forEach(col => {
      const card = document.createElement("a");
      card.className = "collection-card";
      card.href = `#/category/${col.Slug}`;
      
      const count = counts[col.Slug] || 0;
      const iconSvg = getCollectionIcon(col.Slug);

      card.innerHTML = `
        <div class="collection-header">
          <div class="collection-badge-icon">${iconSvg}</div>
          <h3 class="collection-card-title">${col.Title}</h3>
        </div>
        <p class="collection-card-desc">${col.Description || 'Guides and tutorials for ' + col.Title}</p>
        <div class="collection-footer">
          <span>${count} article${count === 1 ? '' : 's'}</span>
          <span class="collection-arrow">Explore &rarr;</span>
        </div>
      `;
      collectionsGrid.appendChild(card);
    });
  }

  // View Routing
  function handleRouting() {
    const hash = window.location.hash || "#/";
    
    // Hide all views first
    collectionsView.style.display = "none";
    categoryView.style.display = "none";
    articleView.style.display = "none";
    searchResultsView.style.display = "none";

    // Clear search query if navigating
    if (!hash.startsWith("#/search") && currentSearchQuery) {
      searchInput.value = "";
      clearSearchBtn.style.display = "none";
      currentSearchQuery = "";
    }

    if (hash === "#/" || hash === "") {
      // Home View
      collectionsView.style.display = "block";
      window.scrollTo(0, 0);
    } else if (hash.startsWith("#/category/")) {
      const catSlug = hash.replace("#/category/", "");
      showCategory(catSlug);
    } else if (hash.startsWith("#/article/")) {
      const rawTarget = hash.replace("#/article/", "");
      // Separate article slug from anchor if present (e.g. slug#heading)
      const [artSlug, subAnchor] = rawTarget.split("#");
      resolveAndShowArticle(artSlug, subAnchor);
    } else if (hash.startsWith("#")) {
      const rawTarget = hash.replace("#", "");
      if (rawTarget.startsWith("h_")) {
        // Just an on-page section jump
        return;
      }
      resolveAndShowArticle(rawTarget);
    }
  }

  // Resolve article by ID, slug, or approximate match
  function resolveAndShowArticle(searchSlug, subAnchor) {
    const clean = searchSlug.toLowerCase().trim();
    let found = kb.Articles.find(a => a.Id === clean);
    if (!found) {
      found = kb.Articles.find(a => a.Id.endsWith(clean) || clean.endsWith(a.Id));
    }
    if (!found) {
      found = kb.Articles.find(a => a.Id.includes(clean) || clean.includes(a.Id));
    }

    if (found) {
      showArticle(found.Id);
      if (subAnchor) {
        setTimeout(() => {
          const el = document.getElementById(subAnchor);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      collectionsView.style.display = "block";
    }
  }

  // Show Category View
  function showCategory(slug) {
    const col = kb.Collections.find(c => c.Slug === slug);
    const articles = kb.Articles.filter(a => a.CategorySlug === slug);

    if (!col) {
      window.location.hash = "#/";
      return;
    }

    categoryTitle.textContent = col.Title;
    categoryDesc.textContent = col.Description || `Find all tutorials and documentation for ${col.Title}.`;

    categoryArticlesGrid.innerHTML = "";
    articles.forEach(art => {
      const card = document.createElement("a");
      card.className = "article-card";
      card.href = `#/article/${art.Id}`;
      card.innerHTML = `
        <h4 class="article-card-title">${art.Title}</h4>
        <p class="article-card-desc">${art.Description || 'Click to view full step-by-step instructions.'}</p>
      `;
      categoryArticlesGrid.appendChild(card);
    });

    categoryView.style.display = "block";
    window.scrollTo(0, 0);
  }

  // Show Article View
  function showArticle(id) {
    const art = kb.Articles.find(a => a.Id === id);
    if (!art) {
      window.location.hash = "#/";
      return;
    }

    articleTitle.textContent = art.Title;
    articleDesc.textContent = art.Description;
    
    // Breadcrumbs
    articleBreadcrumbCat.textContent = art.Category;
    articleBreadcrumbCat.href = `#/category/${art.CategorySlug}`;

    // Body
    articleBody.innerHTML = art.Body;

    // Fix internal anchor clicks if any
    const inLinks = articleBody.querySelectorAll("a");
    inLinks.forEach(l => {
      const href = l.getAttribute("href");
      if (href && href.startsWith("#") && !href.startsWith("#/")) {
        l.href = `#/article/${href.substring(1)}`;
      }
    });

    // Related articles from same category
    relatedArticlesList.innerHTML = "";
    const related = kb.Articles.filter(a => a.CategorySlug === art.CategorySlug && a.Id !== art.Id).slice(0, 5);
    related.forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#/article/${r.Id}">${r.Title}</a>`;
      relatedArticlesList.appendChild(li);
    });

    articleView.style.display = "block";
    window.scrollTo(0, 0);
  }

  // Search Logic
  function performSearch(query) {
    currentSearchQuery = query.trim().toLowerCase();
    
    if (!currentSearchQuery) {
      searchResultsView.style.display = "none";
      clearSearchBtn.style.display = "none";
      handleRouting();
      return;
    }

    clearSearchBtn.style.display = "flex";
    collectionsView.style.display = "none";
    categoryView.style.display = "none";
    articleView.style.display = "none";
    searchResultsView.style.display = "block";

    const results = kb.Articles.filter(art => {
      const titleMatch = art.Title.toLowerCase().includes(currentSearchQuery);
      const descMatch = (art.Description || "").toLowerCase().includes(currentSearchQuery);
      const bodyMatch = art.Body.toLowerCase().includes(currentSearchQuery);
      return titleMatch || descMatch || bodyMatch;
    });

    searchCountBadge.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`;
    searchResultsList.innerHTML = "";

    if (results.length === 0) {
      searchResultsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <h3>No articles found</h3>
          <p>We couldn't find any articles matching "${query}". Try searching with different keywords.</p>
        </div>
      `;
      return;
    }

    results.forEach(art => {
      const item = document.createElement("a");
      item.className = "result-item";
      item.href = `#/article/${art.Id}`;

      // Snippet
      let snippet = art.Description || "";
      if (!snippet) {
        const textContent = art.Body.replace(/<[^>]*>?/gm, '');
        const idx = textContent.toLowerCase().indexOf(currentSearchQuery);
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(textContent.length, idx + 100);
          snippet = "..." + textContent.substring(start, end) + "...";
        } else {
          snippet = textContent.substring(0, 120) + "...";
        }
      }

      item.innerHTML = `
        <div class="result-category">${art.Category}</div>
        <div class="result-title">${art.Title}</div>
        <div class="result-snippet">${snippet}</div>
      `;
      searchResultsList.appendChild(item);
    });
  }

  // Event Listeners
  searchInput.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    performSearch("");
    searchInput.focus();
  });

  window.addEventListener("hashchange", handleRouting);

  // Initialize
  renderCollections();
  handleRouting();
})();
