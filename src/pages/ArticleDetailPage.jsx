import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Avatar,
  Button,
  ActionIcon,
  Tooltip,
  Card,
  SimpleGrid,
  SegmentedControl,
  useMantineColorScheme
} from "@mantine/core";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconHeart,
  IconHeartFilled,
  IconArrowLeft,
  IconClock,
  IconEye,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconCopy,
  IconCheck
} from "@tabler/icons-react";
import { getArticleById, getAggregatedArticles } from "../api/apiService";
import { useApp } from "../context/AppContext";
import ReadingProgressBar from "../components/ReadingProgressBar";
import CommentSection from "../components/CommentSection";
import ArticleCard from "../components/ArticleCard";
import SkeletonGrid from "../components/SkeletonGrid";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const {
    isBookmarked,
    toggleBookmark,
    hasLiked,
    toggleLike,
    readerFontSize,
    setReaderFontSize,
    showToast
  } = useApp();

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      setLoading(true);
      const data = await getArticleById(id);
      setArticle(data);

      // Load related articles
      const all = await getAggregatedArticles();
      const related = all
        .filter((a) => a.id !== id && (a.category === data?.category || a.tags?.some((t) => data?.tags?.includes(t))))
        .slice(0, 3);
      setRelatedArticles(related);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <SkeletonGrid count={2} viewMode="list" />
      </Container>
    );
  }

  if (!article) {
    return (
      <Container size="sm" py={60} ta="center">
        <Title order={2}>Article Not Found</Title>
        <Text c="dimmed" mt="sm" mb="lg">
          The requested article could not be located.
        </Text>
        <Button component={Link} to="/" variant="gradient" gradient={{ from: "indigo", to: "violet" }}>
          Return Home
        </Button>
      </Container>
    );
  }

  const bookmarked = isBookmarked(article.id);
  const liked = hasLiked(article.id);
  const currentLikes = article.likesCount + (liked ? 1 : 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // Calculate font size multiplier based on user preference
  const fontSizeStyle = {
    fontSize: readerFontSize === "sm" ? "1.05rem" : readerFontSize === "lg" ? "1.28rem" : "1.15rem",
    lineHeight: readerFontSize === "lg" ? "2.0" : "1.85"
  };

  return (
    <>
      <ReadingProgressBar />

      <Container size="md" py="xl">
        {/* Back Link */}
        <Group mb="lg">
          <Button
            component={Link}
            to="/articles"
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to Articles
          </Button>
        </Group>

        {/* Category & Metadata */}
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <Badge variant="filled" color="indigo" size="md">
              {article.category}
            </Badge>
            <Badge variant="outline" color="gray" size="sm">
              Source: {article.source}
            </Badge>
          </Group>

          <Group gap="md">
            <Group gap={4}>
              <IconClock size={16} color="#8c96ab" />
              <Text size="xs" c="dimmed">
                {article.readingTime} min read
              </Text>
            </Group>
            <Group gap={4}>
              <IconEye size={16} color="#8c96ab" />
              <Text size="xs" c="dimmed">
                {article.viewsCount?.toLocaleString()} views
              </Text>
            </Group>
          </Group>
        </Group>

        {/* Main Title */}
        <Title
          order={1}
          style={{
            fontSize: "clamp(2rem, 3.8vw, 2.85rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
            marginTop: 12,
            marginBottom: 20
          }}
        >
          {article.title}
        </Title>

        {/* Author Bio Row & Quick Action Toolbar */}
        <Group justify="space-between" align="center" wrap="wrap" pb="md" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)" }}>
          <Group gap="sm">
            <Avatar src={article.author?.avatar} size={48} radius="xl" />
            <div>
              <Text fw={700} size="sm">
                {article.author?.name}
              </Text>
              <Text size="xs" c="dimmed">
                {article.author?.role || "Staff Author"} • Published on {formattedDate}
              </Text>
            </div>
          </Group>

          {/* Reader Preferences & Actions */}
          <Group gap="xs">
            {/* Font Size Adjuster for Reader Accessibility */}
            <Group gap={4} mr="xs">
              <Text size="11px" c="dimmed">
                Text Size:
              </Text>
              <SegmentedControl
                size="xs"
                radius="sm"
                value={readerFontSize}
                onChange={setReaderFontSize}
                data={[
                  { label: "A-", value: "sm" },
                  { label: "A", value: "md" },
                  { label: "A+", value: "lg" }
                ]}
              />
            </Group>

            <Tooltip label={liked ? "Liked" : "Like story"}>
              <ActionIcon
                variant={liked ? "filled" : "light"}
                color={liked ? "red" : "gray"}
                size="lg"
                radius="md"
                onClick={() => toggleLike(article.id)}
                aria-label="Like story"
              >
                {liked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
              </ActionIcon>
            </Tooltip>
            <Text size="xs" fw={700} mr="xs">
              {currentLikes}
            </Text>

            <Tooltip label={bookmarked ? "Remove bookmark" : "Save article"}>
              <ActionIcon
                variant={bookmarked ? "filled" : "light"}
                color={bookmarked ? "indigo" : "gray"}
                size="lg"
                radius="md"
                onClick={() => toggleBookmark(article)}
                aria-label="Bookmark article"
              >
                {bookmarked ? <IconBookmarkFilled size={18} /> : <IconBookmark size={18} />}
              </ActionIcon>
            </Tooltip>

            <Tooltip label={copied ? "Link Copied!" : "Copy Link"}>
              <ActionIcon
                variant="light"
                color={copied ? "teal" : "gray"}
                size="lg"
                radius="md"
                onClick={handleCopyLink}
                aria-label="Copy share link"
              >
                {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Share on Twitter / X">
              <ActionIcon
                variant="light"
                color="blue"
                size="lg"
                radius="md"
                component="a"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <IconBrandTwitter size={18} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Share on LinkedIn">
              <ActionIcon
                variant="light"
                color="indigo"
                size="lg"
                radius="md"
                component="a"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <IconBrandLinkedin size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {/* Hero Cover Image */}
        {article.coverImage && (
          <div
            style={{
              width: "100%",
              maxHeight: 460,
              borderRadius: 16,
              overflow: "hidden",
              margin: "28px 0",
              boxShadow: isDark ? "0 20px 30px rgba(0,0,0,0.4)" : "0 15px 30px rgba(79, 70, 229, 0.1)"
            }}
          >
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${article.id}/1200/600`;
              }}
            />
          </div>
        )}

        {/* Article Body Content */}
        <article className="article-markdown-body" style={fontSizeStyle}>
          {renderFormattedContent(article.content || article.description)}
        </article>

        {/* Article Tags Cloud */}
        {article.tags && article.tags.length > 0 && (
          <Group gap="xs" my={36}>
            <Text size="xs" fw={700} c="dimmed">
              Tagged In:
            </Text>
            {article.tags.map((tag) => (
              <Badge
                key={tag}
                component={Link}
                to={`/articles?tag=${encodeURIComponent(tag)}`}
                variant="outline"
                color="indigo"
                size="sm"
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                #{tag}
              </Badge>
            ))}
          </Group>
        )}

        {/* Author Bio Card */}
        <Card
          padding="lg"
          radius="lg"
          my={36}
          style={{
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(79, 70, 229, 0.04)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(79, 70, 229, 0.12)"
          }}
        >
          <Group align="flex-start" gap="md">
            <Avatar src={article.author?.avatar} size={64} radius="xl" />
            <div style={{ flex: 1 }}>
              <Text fw={700} size="md">
                Written by {article.author?.name}
              </Text>
              <Text size="xs" c="indigo" fw={600} mb={6}>
                {article.author?.role || "Engineering Contributor"}
              </Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                {article.author?.bio || "Passionate about software architecture, clean code, and scalable web applications."}
              </Text>
            </div>
          </Group>
        </Card>

        {/* Reader Discussion / Comments */}
        <div style={{ margin: "40px 0" }}>
          <CommentSection articleId={article.id} />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div style={{ marginTop: 50 }}>
            <Title order={3} mb="lg" style={{ letterSpacing: "-0.02em" }}>
              Related Stories & Perspectives
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} viewMode="grid" />
              ))}
            </SimpleGrid>
          </div>
        )}
      </Container>
    </>
  );
}

// Markdown parser helper for rich headers, paragraphs, and code snippets
function renderFormattedContent(raw) {
  if (!raw) return null;

  const lines = raw.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`}>
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={index}>{line.replace("# ", "")}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={index}>{line.replace("## ", "")}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={index}>{line.replace("### ", "")}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(<blockquote key={index}>{line.replace("> ", "")}</blockquote>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={index} style={{ marginLeft: 24, marginBottom: 6 }}>
          {line.replace(/^[-*]\s+/, "")}
        </li>
      );
    } else if (line.trim().length > 0) {
      elements.push(<p key={index}>{line}</p>);
    }
  });

  return elements;
}
