import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Avatar,
  ActionIcon,
  Tooltip,
  Stack,
  useMantineColorScheme
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconClock,
  IconEye,
  IconMessageCircle
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";

// Map category to aesthetic Mantine color
const categoryColors = {
  Architecture: "indigo",
  "AI & ML": "violet",
  Design: "pink",
  Development: "blue",
  DevOps: "cyan",
  Performance: "teal"
};

export default function ArticleCard({ article, viewMode = "grid" }) {
  const { isBookmarked, toggleBookmark, hasLiked, toggleLike } = useApp();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const [imgSrc, setImgSrc] = useState(
    article.coverImage || `https://picsum.photos/seed/${article.id}/800/500`
  );
  const [likeBurst, setLikeBurst] = useState(false);

  const bookmarked = isBookmarked(article.id);
  const liked = hasLiked(article.id);
  const currentLikes = article.likesCount + (liked ? 1 : 0);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikeBurst(true);
    setTimeout(() => setLikeBurst(false), 400);
    toggleLike(article.id);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(article);
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const categoryColor = categoryColors[article.category] || "indigo";

  // LIST VIEW LAYOUT
  if (viewMode === "list") {
    return (
      <Card
        component={Link}
        to={`/article/${article.id}`}
        padding="md"
        radius="lg"
        className="hover-lift"
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "row",
          gap: 20,
          alignItems: "stretch",
          backgroundColor: isDark ? "rgba(26, 27, 30, 0.75)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)"
        }}
      >
        <div
          className="zoom-container"
          style={{
            width: 240,
            minWidth: 200,
            borderRadius: 12,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Image
            src={imgSrc}
            onError={() => setImgSrc(`https://picsum.photos/seed/alt-${article.id}/800/500`)}
            alt={article.title}
            className="zoom-image"
            height="100%"
            style={{ objectFit: "cover", width: "100%", height: "100%", minHeight: 140 }}
          />
          <Badge
            color={categoryColor}
            variant="filled"
            size="xs"
            style={{ position: "absolute", top: 10, left: 10, textTransform: "capitalize" }}
          >
            {article.category}
          </Badge>
        </div>

        <Stack justify="space-between" style={{ flex: 1, padding: "4px 0" }} gap="xs">
          <div>
            <Group justify="space-between" mb={4}>
              <Group gap="xs">
                <Badge size="xs" variant="outline" color="gray">
                  {article.source}
                </Badge>
                <Group gap={4}>
                  <IconClock size={13} color="#8c96ab" />
                  <Text size="xs" c="dimmed">
                    {article.readingTime} min read
                  </Text>
                </Group>
              </Group>

              <Group gap={4}>
                <Tooltip label={bookmarked ? "Remove Bookmark" : "Save Article"}>
                  <ActionIcon
                    variant="subtle"
                    color={bookmarked ? "indigo" : "gray"}
                    onClick={handleBookmark}
                    aria-label="Bookmark article"
                  >
                    {bookmarked ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
                  </ActionIcon>
                </Tooltip>

                <Tooltip label={liked ? "Liked" : "Like Article"}>
                  <ActionIcon
                    variant="subtle"
                    color={liked ? "red" : "gray"}
                    onClick={handleLike}
                    className={likeBurst ? "animate-burst" : ""}
                    aria-label="Like article"
                  >
                    {liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Text fw={700} size="lg" lineClamp={2} style={{ lineHeight: 1.35 }}>
              {article.title}
            </Text>

            <Text size="sm" c="dimmed" lineClamp={2} mt={6}>
              {article.description}
            </Text>
          </div>

          <Group justify="space-between" align="center" mt="xs">
            <Group gap="xs">
              <Avatar src={article.author?.avatar} size={28} radius="xl" />
              <div>
                <Text size="xs" fw={600}>
                  {article.author?.name}
                </Text>
                <Text size="11px" c="dimmed">
                  {formattedDate}
                </Text>
              </div>
            </Group>

            <Group gap="md">
              <Group gap={4}>
                <IconHeart size={14} color="#8c96ab" />
                <Text size="xs" c="dimmed">
                  {currentLikes}
                </Text>
              </Group>
              <Group gap={4}>
                <IconMessageCircle size={14} color="#8c96ab" />
                <Text size="xs" c="dimmed">
                  {article.commentsCount}
                </Text>
              </Group>
            </Group>
          </Group>
        </Stack>
      </Card>
    );
  }

  // GRID VIEW LAYOUT (DEFAULT)
  return (
    <Card
      component={Link}
      to={`/article/${article.id}`}
      padding={0}
      radius="lg"
      className="hover-lift"
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: isDark ? "rgba(26, 27, 30, 0.75)" : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden"
      }}
    >
      {/* Cover Image & Category Badge */}
      <div className="zoom-container" style={{ height: 190, width: "100%", position: "relative" }}>
        <Image
          src={imgSrc}
          onError={() => setImgSrc(`https://picsum.photos/seed/alt-${article.id}/800/500`)}
          alt={article.title}
          className="zoom-image"
          height={190}
          style={{ objectFit: "cover", width: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Badge color={categoryColor} variant="filled" size="sm" style={{ textTransform: "capitalize", fontWeight: 700 }}>
            {article.category}
          </Badge>

          <Badge size="xs" variant="gradient" gradient={{ from: "dark", to: "gray", deg: 90 }} style={{ opacity: 0.9 }}>
            {article.source}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <Stack justify="space-between" p="md" style={{ flex: 1 }} gap="md">
        <div>
          {/* Metadata */}
          <Group justify="space-between" mb={8}>
            <Group gap={4}>
              <IconClock size={14} color="#8c96ab" />
              <Text size="xs" c="dimmed">
                {article.readingTime} min read
              </Text>
            </Group>

            <Group gap={4}>
              <IconEye size={14} color="#8c96ab" />
              <Text size="xs" c="dimmed">
                {article.viewsCount?.toLocaleString()}
              </Text>
            </Group>
          </Group>

          {/* Title */}
          <Text fw={700} size="md" lineClamp={2} style={{ lineHeight: 1.35 }}>
            {article.title}
          </Text>

          {/* Description */}
          <Text size="xs" c="dimmed" lineClamp={3} mt={8} style={{ lineHeight: 1.5 }}>
            {article.description}
          </Text>
        </div>

        {/* Footer: Author & Interactive Buttons */}
        <div>
          <Group justify="space-between" align="center" pt="xs" style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)" }}>
            <Group gap="xs">
              <Avatar src={article.author?.avatar} size={28} radius="xl" />
              <div>
                <Text size="xs" fw={600} lineClamp={1}>
                  {article.author?.name}
                </Text>
                <Text size="10px" c="dimmed">
                  {formattedDate}
                </Text>
              </div>
            </Group>

            <Group gap={2}>
              <Tooltip label={liked ? "Liked" : "Like Article"}>
                <ActionIcon
                  variant="subtle"
                  color={liked ? "red" : "gray"}
                  size="sm"
                  onClick={handleLike}
                  className={likeBurst ? "animate-burst" : ""}
                  aria-label="Like article"
                >
                  {liked ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
                </ActionIcon>
              </Tooltip>
              <Text size="xs" c="dimmed" mr={4}>
                {currentLikes}
              </Text>

              <Tooltip label={bookmarked ? "Remove Bookmark" : "Save Article"}>
                <ActionIcon
                  variant="subtle"
                  color={bookmarked ? "indigo" : "gray"}
                  size="sm"
                  onClick={handleBookmark}
                  aria-label="Bookmark article"
                >
                  {bookmarked ? <IconBookmarkFilled size={16} /> : <IconBookmark size={16} />}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </div>
      </Stack>
    </Card>
  );
}
