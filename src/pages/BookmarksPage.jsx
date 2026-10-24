import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Group,
  SimpleGrid,
  Button,
  Card,
  TextInput,
  Badge
} from "@mantine/core";
import {
  IconBookmark,
  IconSearch,
  IconArrowRight,
  IconBooks
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";
import ArticleCard from "../components/ArticleCard";

export default function BookmarksPage() {
  const { bookmarks } = useApp();
  const [filterQuery, setFilterQuery] = useState("");

  const filtered = bookmarks.filter((b) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.author?.name?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q)
    );
  });

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <div>
            <Group gap="xs" mb={6}>
              <IconBookmark size={20} color="#4f46e5" />
              <Text size="xs" fw={700} c="indigo" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Personal Reading Queue
              </Text>
            </Group>
            <Title order={1} style={{ letterSpacing: "-0.03em" }}>
              Saved Articles & Bookmarks
            </Title>
            <Text size="md" c="dimmed" mt={4}>
              All articles saved locally to your browser. Read offline or at your leisure.
            </Text>
          </div>

          <Badge size="lg" color="indigo" variant="light">
            {bookmarks.length} {bookmarks.length === 1 ? "Article" : "Articles"} Saved
          </Badge>
        </Group>
      </div>

      {/* Search inside Bookmarks */}
      {bookmarks.length > 0 && (
        <Group mb="xl">
          <TextInput
            placeholder="Search saved articles..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ width: "100%", maxWidth: 360 }}
          />
        </Group>
      )}

      {/* Bookmarks Listing */}
      {bookmarks.length === 0 ? (
        <Card padding="xl" radius="lg" withBorder ta="center" py={60}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}
          >
            <IconBooks size={28} color="#4f46e5" />
          </div>
          <Title order={2} size="h3">
            Your reading list is empty
          </Title>
          <Text size="sm" c="dimmed" mt="xs" mb="lg" style={{ maxWidth: 420, margin: "8px auto 24px" }}>
            As you browse Chronicle, tap the bookmark icon on any card to save stories here for uninterrupted reading.
          </Text>
          <Button
            component={Link}
            to="/articles"
            variant="gradient"
            gradient={{ from: "indigo", to: "violet" }}
            rightSection={<IconArrowRight size={16} />}
          >
            Explore Articles
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card padding="xl" radius="lg" withBorder ta="center" py={40}>
          <Text fw={700} size="md">
            No bookmarks match "{filterQuery}"
          </Text>
          <Button variant="light" color="indigo" mt="md" onClick={() => setFilterQuery("")}>
            Reset Filter
          </Button>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} viewMode="grid" />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
