import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Group,
  SimpleGrid,
  Stack,
  Pagination,
  Badge,
  Card,
  Button
} from "@mantine/core";
import { IconArticle, IconTags } from "@tabler/icons-react";
import { getAggregatedArticles } from "../api/apiService";
import { useApp } from "../context/AppContext";
import ArticleCard from "../components/ArticleCard";
import FilterBar from "../components/FilterBar";
import SkeletonGrid from "../components/SkeletonGrid";

const ITEMS_PER_PAGE = 9;

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    sortBy,
    viewMode
  } = useApp();

  // Sync URL query params if user lands directly on /articles?q=... or ?category=...
  useEffect(() => {
    const urlQ = searchParams.get("q");
    if (urlQ && urlQ !== searchQuery) {
      setSearchQuery(urlQ);
    }
    const urlCat = searchParams.get("category");
    if (urlCat && urlCat !== selectedCategory) {
      setSelectedCategory(urlCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAggregatedArticles();
      setArticles(data);
      setLoading(false);
    }
    load();
  }, []);

  // Filter & Sort
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTag) {
      result = result.filter((a) =>
        (a.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.author?.name?.toLowerCase().includes(q)
      );
    }

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

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const pagedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  // Extract popular tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    articles.forEach((a) => {
      (a.tags || []).forEach((t) => tagSet.add(t.toLowerCase()));
    });
    return Array.from(tagSet).slice(0, 14);
  }, [articles]);

  return (
    <Container size="xl" py="xl">
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <Group gap="xs" mb={6}>
          <IconArticle size={20} color="#4f46e5" />
          <Text size="xs" fw={700} c="indigo" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Comprehensive Catalog
          </Text>
        </Group>
        <Title order={1} style={{ letterSpacing: "-0.03em" }}>
          Discover In-Depth Articles & Technical Guides
        </Title>
        <Text size="md" c="dimmed" mt={6}>
          Aggregated and normalized in real-time from Dev.to, DummyJSON, and Chronicle original creators.
        </Text>
      </div>

      {/* Filter and Sorting Bar */}
      <FilterBar totalCount={filteredArticles.length} />

      {/* Popular Tags Strip */}
      <Group gap={6} mb="xl" wrap="wrap">
        <Group gap={4} mr="xs">
          <IconTags size={15} color="#8c96ab" />
          <Text size="xs" c="dimmed" fw={600}>
            Popular Tags:
          </Text>
        </Group>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            size="sm"
            variant={selectedTag === tag ? "filled" : "outline"}
            color="indigo"
            style={{ cursor: "pointer", textTransform: "lowercase" }}
            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
          >
            #{tag}
          </Badge>
        ))}
      </Group>

      {/* Articles Grid or List */}
      {loading ? (
        <SkeletonGrid count={ITEMS_PER_PAGE} viewMode={viewMode} />
      ) : pagedArticles.length === 0 ? (
        <Card padding="xl" radius="lg" withBorder ta="center" py={50}>
          <Text fw={700} size="lg">
            No matching articles found
          </Text>
          <Text size="sm" c="dimmed" mt="xs" mb="md">
            Try adjusting your query or category selection to see more stories.
          </Text>
          <Button
            variant="light"
            color="indigo"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedTag("");
              setSearchQuery("");
            }}
          >
            Clear All Filters
          </Button>
        </Card>
      ) : viewMode === "list" ? (
        <Stack gap="md">
          {pagedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode="list" />
          ))}
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {pagedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode="grid" />
          ))}
        </SimpleGrid>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <Group justify="center" mt={40}>
          <Pagination
            value={currentPage}
            onChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 120, behavior: "smooth" });
            }}
            total={totalPages}
            radius="md"
            color="indigo"
            size="md"
          />
        </Group>
      )}
    </Container>
  );
}
