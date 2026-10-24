import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Grid,
  Text,
  Badge,
  Group,
  Button,
  Avatar,
  ActionIcon,
  Tooltip,
  useMantineColorScheme
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconClock,
  IconArrowRight,
  IconSparkles,
  IconFlame
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";

export default function ArticleHero({ article }) {
  const { isBookmarked, toggleBookmark, hasLiked, toggleLike } = useApp();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  if (!article) return null;

  const bookmarked = isBookmarked(article.id);
  const liked = hasLiked(article.id);
  const currentLikes = article.likesCount + (liked ? 1 : 0);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div style={{ position: "relative", marginBottom: 36, overflow: "hidden" }}>
      {/* Ambient background glow */}
      <div className="hero-glow" style={{ top: -80, right: -40 }} />
      <div className="hero-glow" style={{ bottom: -60, left: 10, background: "radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)" }} />

      <Card
        padding={0}
        radius="xl"
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: isDark ? "rgba(26, 27, 30, 0.85)" : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isDark ? "0 25px 50px -12px rgba(0,0,0,0.5)" : "0 20px 40px -15px rgba(79, 70, 229, 0.12)",
          overflow: "hidden"
        }}
      >
        <Grid gutter={0} align="stretch">
          {/* Left Column: Content */}
          <Grid.Col span={{ base: 12, md: 7 }} p={{ base: "lg", sm: "xl", lg: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div>
                <Group justify="space-between" mb="md">
                  <Group gap="xs">
                    <Badge
                      variant="gradient"
                      gradient={{ from: "indigo", to: "violet", deg: 90 }}
                      size="md"
                      leftSection={<IconFlame size={14} />}
                    >
                      Featured Story
                    </Badge>
                    <Badge variant="outline" color="indigo" size="md">
                      {article.category}
                    </Badge>
                  </Group>

                  <Group gap={6}>
                    <IconClock size={15} color="#8c96ab" />
                    <Text size="xs" c="dimmed" fw={500}>
                      {article.readingTime} min deep read
                    </Text>
                  </Group>
                </Group>

                <Text
                  component={Link}
                  to={`/article/${article.id}`}
                  fw={800}
                  size="xl"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.025em",
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    marginBottom: 16
                  }}
                >
                  {article.title}
                </Text>

                <Text size="md" c="dimmed" style={{ lineHeight: 1.6, maxWidth: 640 }} lineClamp={3}>
                  {article.description}
                </Text>
              </div>

              {/* Author & CTA Row */}
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)" }}>
                <Group justify="space-between" wrap="wrap" gap="md">
                  <Group gap="sm">
                    <Avatar src={article.author?.avatar} size={44} radius="xl" />
                    <div>
                      <Text fw={700} size="sm">
                        {article.author?.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {article.author?.role || "Staff Author"} • {formattedDate}
                      </Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <Tooltip label={liked ? "Liked" : "Like story"}>
                      <ActionIcon
                        variant="light"
                        color={liked ? "red" : "gray"}
                        size="lg"
                        radius="md"
                        onClick={() => toggleLike(article.id)}
                        aria-label="Like story"
                      >
                        {liked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                      </ActionIcon>
                    </Tooltip>
                    <Text size="sm" fw={600} mr="xs">
                      {currentLikes}
                    </Text>

                    <Tooltip label={bookmarked ? "Remove bookmark" : "Save for later"}>
                      <ActionIcon
                        variant="light"
                        color={bookmarked ? "indigo" : "gray"}
                        size="lg"
                        radius="md"
                        onClick={() => toggleBookmark(article)}
                        aria-label="Bookmark story"
                      >
                        {bookmarked ? <IconBookmarkFilled size={20} /> : <IconBookmark size={20} />}
                      </ActionIcon>
                    </Tooltip>

                    <Button
                      component={Link}
                      to={`/article/${article.id}`}
                      variant="gradient"
                      gradient={{ from: "indigo", to: "violet", deg: 90 }}
                      size="md"
                      radius="md"
                      rightSection={<IconArrowRight size={18} />}
                    >
                      Read Story
                    </Button>
                  </Group>
                </Group>
              </div>
            </div>
          </Grid.Col>

          {/* Right Column: High-Res Hero Image with Glass Card Overlay */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <div
              style={{
                position: "relative",
                height: "100%",
                minHeight: 320,
                backgroundImage: `url(${article.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: isDark
                    ? "linear-gradient(to top, rgba(26,27,30,0.8) 0%, transparent 60%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)"
                }}
              />
              <div style={{ position: "absolute", bottom: 20, right: 20 }}>
                <Badge
                  size="sm"
                  variant="filled"
                  color="dark"
                  leftSection={<IconSparkles size={12} color="#f59e0b" />}
                  style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.65)" }}
                >
                  Aggregated from {article.source}
                </Badge>
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
}
