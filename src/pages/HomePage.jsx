import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  SimpleGrid,
  Stack
} from "@mantine/core";
import {
  IconArrowRight,
  IconSparkles,
  IconRefresh
} from "@tabler/icons-react";
import { getAggregatedArticles } from "../api/apiService";
import { useApp } from "../context/AppContext";
import ArticleHero from "../components/ArticleHero";
import ArticleCard from "../components/ArticleCard";
import FilterBar from "../components/FilterBar";
import SkeletonGrid from "../components/SkeletonGrid";
import StatsBanner from "../components/StatsBanner";
import NewsletterBox from "../components/NewsletterBox";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);

  const {
    searchQuery,
    selectedCategory,
    selectedTag,
    sortBy,
    viewMode
  } = useApp();

  const loadData = async (refresh = false) => {
    setLoading(true);
    const data = await getAggregatedArticles({ refresh });
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Sort Articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((a) =>
        (a.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Search query filter (checks title, description, author name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.author?.name?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "trending") {
      result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.likesCount - a.likesCount);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === "mostLiked") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === "readTime") {
      result.sort((a, b) => a.readingTime - b.readingTime);
    }

    return result;
  }, [articles, selectedCategory, selectedTag, searchQuery, sortBy]);

  const heroArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0];
  }, [articles]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <Container size="xl" py="lg">
      {/* Featured Hero Banner */}
      {loading ? (
        <div style={{ marginBottom: 36 }}>
          <SkeletonGrid count={1} viewMode="list" />
        </div>
      ) : (
        heroArticle && <ArticleHero article={heroArticle} />
      )}

      {/* Platform Architecture & Live Counter Stats Banner */}
      <StatsBanner />

      {/* Main Exploration Section */}
      <div style={{ marginTop: 40 }}>
        <Group justify="space-between" align="flex-end" mb="md">
          <div>
            <Group gap="xs" mb={4}>
              <IconSparkles size={18} color="#4f46e5" />
              <Text size="xs" fw={700} c="indigo" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Curated Engineering & Design Feed
              </Text>
            </Group>
            <Title order={2} style={{ letterSpacing: "-0.02em" }}>
              Explore All Articles
            </Title>
          </div>

          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={() => loadData(true)}
          >
            Refresh Feeds
          </Button>
        </Group>

        {/* Filter & Search Bar */}
        <FilterBar totalCount={filteredArticles.length} />

        {/* Articles Grid / List */}
        {loading ? (
          <SkeletonGrid count={6} viewMode={viewMode} />
        ) : displayedArticles.length === 0 ? (
          <CardWithNoResults />
        ) : viewMode === "list" ? (
          <Stack gap="md">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} viewMode="list" />
            ))}
          </Stack>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} viewMode="grid" />
            ))}
          </SimpleGrid>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <Group justify="center" mt={36}>
            <Button
              variant="outline"
              color="indigo"
              size="md"
              radius="md"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              rightSection={<IconArrowRight size={16} />}
            >
              Load More Articles ({filteredArticles.length - visibleCount} remaining)
            </Button>
          </Group>
        )}
      </div>

      {/* Weekly Newsletter Subscription */}
      <NewsletterBox />
    </Container>
  );
}

function CardWithNoResults() {
  const { resetFilters } = useApp();
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        borderRadius: 16,
        background: "rgba(99, 102, 241, 0.04)",
        border: "1px dashed rgba(99, 102, 241, 0.2)"
      }}
    >
      <Text fw={700} size="lg" mb="xs">
        No articles found matching your criteria
      </Text>
      <Text size="sm" c="dimmed" mb="md" style={{ maxWidth: 420, margin: "0 auto 16px" }}>
        Try searching for a different keyword or resetting your category and tag filters.
      </Text>
      <Button variant="light" color="indigo" onClick={resetFilters}>
        Reset Filters
      </Button>
    </div>
  );
}
