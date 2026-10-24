import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MantineProvider, Notification } from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import "@mantine/core/styles.css";
import "./styles/custom.css";

import { theme } from "./styles/theme";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WriteModal from "./components/WriteModal";

import HomePage from "./pages/HomePage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import BookmarksPage from "./pages/BookmarksPage";
import AboutPage from "./pages/AboutPage";

// Automatically scrolls window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
}

function AppContent() {
  const [writeModalOpened, setWriteModalOpened] = useState(false);
  const { toastNotification } = useApp();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            maxWidth: 400
          }}
        >
          <Notification
            icon={toastNotification.type === "info" ? <IconInfoCircle size={18} /> : <IconCheck size={18} />}
            color={toastNotification.type === "info" ? "indigo" : "teal"}
            radius="md"
            withBorder
            title="Chronicle Update"
          >
            {toastNotification.message}
          </Notification>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar onOpenWriteModal={() => setWriteModalOpened(true)} />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticleDetailPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Write / Publish Modal */}
      <WriteModal opened={writeModalOpened} onClose={() => setWriteModalOpened(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </MantineProvider>
  );
}
