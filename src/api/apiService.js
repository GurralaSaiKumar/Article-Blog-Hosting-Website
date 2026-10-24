import { SAMPLE_ARTICLES } from "./sampleData";

// In-Memory Cache with 5-minute TTL to optimize frontend performance
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Category mapping helper to normalize diverse tags into clean Chronicle categories
function mapTagToCategory(tags = [], title = "") {
  const combined = (tags.join(" ") + " " + title).toLowerCase();
  if (combined.includes("ai") || combined.includes("gpt") || combined.includes("machine") || combined.includes("model")) {
    return "AI & ML";
  }
  if (combined.includes("css") || combined.includes("design") || combined.includes("ux") || combined.includes("ui")) {
    return "Design";
  }
  if (combined.includes("devops") || combined.includes("docker") || combined.includes("cloud") || combined.includes("aws")) {
    return "DevOps";
  }
  if (combined.includes("perf") || combined.includes("optimi") || combined.includes("vitals")) {
    return "Performance";
  }
  if (combined.includes("architect") || combined.includes("system") || combined.includes("scale")) {
    return "Architecture";
  }
  return "Development";
}

// Map Dev.to API object to unified Chronicle schema
function normalizeDevToArticle(item) {
  const category = mapTagToCategory(item.tag_list || [], item.title);
  const fallbackCover = `https://picsum.photos/seed/devto-${item.id}/800/500`;

  return {
    id: `devto-${item.id}`,
    rawId: item.id,
    source: "Dev.to API",
    title: item.title,
    description: item.description || "Read this insightful deep-dive on modern software development.",
    content: item.body_markdown || item.description || "",
    category,
    tags: Array.isArray(item.tag_list) && item.tag_list.length > 0 ? item.tag_list.slice(0, 4) : [category.toLowerCase()],
    coverImage: item.cover_image || item.social_image || fallbackCover,
    author: {
      name: item.user?.name || "Dev Community Author",
      username: item.user?.username || "dev_author",
      avatar: item.user?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user?.username || item.id}`,
      role: "Dev.to Contributor",
      bio: "Tech writer and developer sharing engineering insights with the global community."
    },
    publishedAt: item.published_at || new Date().toISOString(),
    readingTime: item.reading_time_minutes || Math.max(3, Math.ceil((item.description || "").length / 100)),
    likesCount: item.positive_reactions_count || Math.floor(Math.random() * 80) + 15,
    commentsCount: item.comments_count || Math.floor(Math.random() * 12) + 2,
    viewsCount: (item.page_views_count || Math.floor(Math.random() * 2500) + 500),
    featured: false,
    trending: (item.positive_reactions_count || 0) > 40
  };
}

// Map DummyJSON Posts API object to unified Chronicle schema
function normalizeDummyJsonArticle(item, userMap = {}) {
  const category = mapTagToCategory(item.tags || [], item.title);
  const fallbackCover = `https://picsum.photos/seed/dummy-${item.id}/800/500`;
  const authorData = userMap[item.userId] || {
    firstName: "Alex",
    lastName: "Taylor",
    username: `user_${item.userId}`,
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user_${item.userId}`,
    company: { title: "Technical Writer" }
  };

  return {
    id: `dummy-${item.id}`,
    rawId: item.id,
    source: "DummyJSON API",
    title: item.title,
    description: item.body ? item.body.slice(0, 140) + "..." : "Explore this community article on modern technology.",
    content: `# ${item.title}\n\n${item.body}\n\n## Perspectives & Implementation\n\nModern software teams continually adapt to changing technological landscapes. When implementing solutions, testing assumptions early and gathering user feedback ensures maximum value delivery.`,
    category,
    tags: Array.isArray(item.tags) ? item.tags : [category.toLowerCase()],
    coverImage: fallbackCover,
    author: {
      name: `${authorData.firstName || "Alex"} ${authorData.lastName || "Taylor"}`,
      username: authorData.username || `author_${item.userId}`,
      avatar: authorData.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`,
      role: authorData.company?.title || "Community Contributor",
      bio: "Sharing stories, product perspectives, and engineering experiences."
    },
    publishedAt: new Date(Date.now() - (item.id * 86400000 * 2)).toISOString(),
    readingTime: Math.max(3, Math.ceil((item.body || "").length / 120)),
    likesCount: (typeof item.reactions === "object" ? item.reactions?.likes : item.reactions) || Math.floor(Math.random() * 95) + 20,
    commentsCount: Math.floor(Math.random() * 15) + 3,
    viewsCount: item.views || (item.id * 180 + 350),
    featured: false,
    trending: item.id % 4 === 0
  };
}

// Fetch Dev.to articles with timeout
async function fetchDevToArticles() {
  const cacheKey = "api_devto_articles";
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch("https://dev.to/api/articles?per_page=16&top=14", {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Dev.to responded with ${res.status}`);
    const data = await res.json();
    const normalized = data.map(normalizeDevToArticle);
    setCached(cacheKey, normalized);
    return normalized;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("Dev.to API fetch failed, fallback used:", err.message);
    return [];
  }
}

// Fetch DummyJSON articles with user profiles
async function fetchDummyJsonArticles() {
  const cacheKey = "api_dummyjson_articles";
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const [postsRes, usersRes] = await Promise.all([
      fetch("https://dummyjson.com/posts?limit=16", { signal: controller.signal }),
      fetch("https://dummyjson.com/users?limit=30&select=firstName,lastName,username,image,company", { signal: controller.signal }).catch(() => null)
    ]);
    clearTimeout(timeoutId);

    if (!postsRes.ok) throw new Error(`DummyJSON responded with ${postsRes.status}`);
    const postsData = await postsRes.json();

    let userMap = {};
    if (usersRes && usersRes.ok) {
      const usersData = await usersRes.json();
      (usersData.users || []).forEach(u => {
        userMap[u.id] = u;
      });
    }

    const normalized = (postsData.posts || []).map(p => normalizeDummyJsonArticle(p, userMap));
    setCached(cacheKey, normalized);
    return normalized;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("DummyJSON API fetch failed, fallback used:", err.message);
    return [];
  }
}

// Retrieve custom articles stored by user in localStorage
function getUserPublishedArticles() {
  try {
    const saved = localStorage.getItem("chronicle_custom_articles");
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

// Save a newly authored article to localStorage
export function saveCustomArticle(articleData) {
  try {
    const existing = getUserPublishedArticles();
    const newArticle = {
      ...articleData,
      id: `custom-${Date.now()}`,
      source: "Chronicle Creator Studio",
      publishedAt: new Date().toISOString(),
      likesCount: 1,
      commentsCount: 0,
      viewsCount: 1,
      featured: true,
      trending: true
    };
    const updated = [newArticle, ...existing];
    localStorage.setItem("chronicle_custom_articles", JSON.stringify(updated));
    // Invalidate main cache
    cache.delete("all_aggregated_articles");
    return newArticle;
  } catch (e) {
    console.error("Failed to save custom article:", e);
    return null;
  }
}

// Aggregated articles fetcher combining Dev.to, DummyJSON, local samples, and user published
export async function getAggregatedArticles({ refresh = false } = {}) {
  const cacheKey = "all_aggregated_articles";
  if (!refresh) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  // Fetch concurrently from multiple API endpoints
  const [devToArticles, dummyJsonArticles] = await Promise.all([
    fetchDevToArticles(),
    fetchDummyJsonArticles()
  ]);

  const userArticles = getUserPublishedArticles();

  // Combine data gracefully
  let combined = [
    ...userArticles,
    ...SAMPLE_ARTICLES,
    ...devToArticles,
    ...dummyJsonArticles
  ];

  // De-duplicate by ID
  const seen = new Set();
  const uniqueArticles = [];
  for (const art of combined) {
    if (!seen.has(art.id)) {
      seen.add(art.id);
      uniqueArticles.push(art);
    }
  }

  setCached(cacheKey, uniqueArticles);
  return uniqueArticles;
}

// Fetch single article by unified ID
export async function getArticleById(id) {
  const cacheKey = `article_detail_${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Check in current aggregated list first
  const all = await getAggregatedArticles();
  let found = all.find(a => a.id === id);

  if (found && found.content && found.content.length > 250) {
    setCached(cacheKey, found);
    return found;
  }

  // If it's a devto article, fetch rich full content from Dev.to API
  if (id.startsWith("devto-")) {
    const rawId = id.replace("devto-", "");
    try {
      const res = await fetch(`https://dev.to/api/articles/${rawId}`);
      if (res.ok) {
        const fullDevTo = await res.json();
        const enriched = {
          ...(found || normalizeDevToArticle(fullDevTo)),
          content: fullDevTo.body_markdown || fullDevTo.body_html || fullDevTo.description,
          likesCount: fullDevTo.positive_reactions_count || found?.likesCount || 42,
          commentsCount: fullDevTo.comments_count || found?.commentsCount || 8
        };
        setCached(cacheKey, enriched);
        return enriched;
      }
    } catch (e) {
      console.warn("Failed fetching full Dev.to article body:", e);
    }
  }

  if (found) {
    setCached(cacheKey, found);
    return found;
  }

  // Final fallback to first sample article
  return SAMPLE_ARTICLES[0];
}

// Fetch comments for an article
export async function getArticleComments(articleId) {
  const localCommentsKey = `comments_${articleId}`;
  let localComments = [];
  try {
    const stored = localStorage.getItem(localCommentsKey);
    if (stored) localComments = JSON.parse(stored);
  } catch (e) {}

  // If dummyjson article, fetch initial comments from DummyJSON
  if (articleId.startsWith("dummy-")) {
    const postId = articleId.replace("dummy-", "");
    try {
      const res = await fetch(`https://dummyjson.com/comments/post/${postId}`);
      if (res.ok) {
        const data = await res.json();
        const apiComments = (data.comments || []).map(c => ({
          id: `comment-api-${c.id}`,
          author: c.user?.fullName || c.user?.username || "Community Reader",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.username || c.id}`,
          date: "2 days ago",
          content: c.body,
          likes: Math.floor(Math.random() * 12) + 1
        }));
        return [...localComments, ...apiComments];
      }
    } catch (e) {}
  }

  // Default seed comments if none yet
  if (localComments.length === 0) {
    return [
      {
        id: "seed-1",
        author: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        date: "Yesterday at 3:45 PM",
        content: "Outstanding analysis! The comparison between fine-grained reactivity and traditional virtual DOM diffing was particularly enlightening.",
        likes: 14
      },
      {
        id: "seed-2",
        author: "David Kovacs",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "3 days ago",
        content: "We recently migrated our edge routing to modern CDN PoPs and noticed an immediate drop in TTFB. Great to see this documented here.",
        likes: 9
      }
    ];
  }

  return localComments;
}

// Save a new comment to localStorage
export function addArticleComment(articleId, commentText, authorName = "Reader") {
  const localCommentsKey = `comments_${articleId}`;
  let existing = [];
  try {
    const stored = localStorage.getItem(localCommentsKey);
    if (stored) existing = JSON.parse(stored);
  } catch (e) {}

  const newComment = {
    id: `local-comment-${Date.now()}`,
    author: authorName,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
    date: "Just now",
    content: commentText,
    likes: 0
  };

  const updated = [newComment, ...existing];
  try {
    localStorage.setItem(localCommentsKey, JSON.stringify(updated));
  } catch (e) {}

  return updated;
}

// Check live API statuses for About/Architecture monitoring dashboard
export async function checkApiHealth() {
  const results = {
    devto: { name: "Dev.to API", endpoint: "https://dev.to/api/articles", status: "checking", latencyMs: 0 },
    dummyjson: { name: "DummyJSON API", endpoint: "https://dummyjson.com/posts", status: "checking", latencyMs: 0 }
  };

  const ping = async (url) => {
    const start = performance.now();
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(4000) }).catch(() => 
        fetch(url, { signal: AbortSignal.timeout(4000) })
      );
      const latency = Math.round(performance.now() - start);
      return { status: res.ok ? "healthy" : "degraded", latencyMs: latency };
    } catch (e) {
      return { status: "offline", latencyMs: Math.round(performance.now() - start) };
    }
  };

  const [devRes, dummyRes] = await Promise.all([
    ping("https://dev.to/api/articles?per_page=1"),
    ping("https://dummyjson.com/posts?limit=1")
  ]);

  results.devto.status = devRes.status;
  results.devto.latencyMs = devRes.latencyMs;
  results.dummyjson.status = dummyRes.status;
  results.dummyjson.latencyMs = dummyRes.latencyMs;

  return results;
}
