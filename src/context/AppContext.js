import React, { createContext, useContext, useState, useEffect } from "react";
import { saveCustomArticle } from "../api/apiService";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Bookmarks persistence
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem("chronicle_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Likes persistence
  const [likes, setLikes] = useState(() => {
    try {
      const stored = localStorage.getItem("chronicle_likes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI preferences
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("chronicle_view_mode") || "grid";
    } catch {
      return "grid";
    }
  });

  const [readerFontSize, setReaderFontSize] = useState("md"); // sm, md, lg
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortBy, setSortBy] = useState("trending"); // trending, newest, mostLiked, readTime

  // Toast / notification state
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setToastNotification({ id: Date.now(), message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  useEffect(() => {
    try {
      localStorage.setItem("chronicle_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem("chronicle_likes", JSON.stringify(likes));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [likes]);

  useEffect(() => {
    try {
      localStorage.setItem("chronicle_view_mode", viewMode);
    } catch (e) {}
  }, [viewMode]);

  // Toggle bookmark for an article
  const toggleBookmark = (article) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some((item) => item.id === article.id);
      if (isBookmarked) {
        showToast(`Removed "${article.title.slice(0, 30)}..." from bookmarks`, "info");
        return prev.filter((item) => item.id !== article.id);
      } else {
        showToast(`Saved "${article.title.slice(0, 30)}..." to your reading list`, "success");
        return [{ ...article, savedAt: new Date().toISOString() }, ...prev];
      }
    });
  };

  const isBookmarked = (id) => bookmarks.some((b) => b.id === id);

  // Toggle like/reaction
  const toggleLike = (articleId) => {
    setLikes((prev) => {
      const hasLiked = prev.includes(articleId);
      if (hasLiked) {
        return prev.filter((id) => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  const hasLiked = (id) => likes.includes(id);

  // Add custom article
  const publishArticle = (data) => {
    const created = saveCustomArticle(data);
    if (created) {
      showToast("Article published successfully to Chronicle!", "success");
    }
    return created;
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTag("");
    setSortBy("trending");
  };

  return (
    <AppContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        isBookmarked,
        likes,
        toggleLike,
        hasLiked,
        viewMode,
        setViewMode,
        readerFontSize,
        setReaderFontSize,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedTag,
        setSelectedTag,
        sortBy,
        setSortBy,
        resetFilters,
        publishArticle,
        toastNotification,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
