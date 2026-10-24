import React, { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Text,
  Group,
  Avatar,
  Textarea,
  TextInput,
  Button,
  ActionIcon,
  Badge,
  useMantineColorScheme
} from "@mantine/core";
import { IconHeart, IconHeartFilled, IconSend, IconMessages } from "@tabler/icons-react";
import { getArticleComments, addArticleComment } from "../api/apiService";

export default function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [commentLikes, setCommentLikes] = useState({});
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const data = await getArticleComments(articleId);
      if (mounted) {
        setComments(data);
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [articleId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const name = authorName.trim() || "Anonymous Reader";
    const updated = addArticleComment(articleId, newText.trim(), name);
    setComments(updated);
    setNewText("");
  };

  const toggleCommentLike = (commentId) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  return (
    <Card
      padding="xl"
      radius="lg"
      withBorder
      style={{
        backgroundColor: isDark ? "rgba(26, 27, 30, 0.7)" : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)"
      }}
    >
      <Group justify="space-between" mb="lg">
        <Group gap="xs">
          <IconMessages size={22} color="#4f46e5" />
          <Text fw={700} size="lg">
            Reader Discussion
          </Text>
        </Group>
        <Badge variant="light" color="indigo" size="md">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </Badge>
      </Group>

      {/* New Comment Submission Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 28 }}>
        <Stack gap="xs">
          <TextInput
            placeholder="Your name or handle (e.g. Alex Chen)"
            size="sm"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <Textarea
            placeholder="Join the discussion... share your thoughts, critiques, or experiences."
            minRows={3}
            maxRows={6}
            autosize
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            required
          />
          <Group justify="flex-end">
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "indigo", to: "violet" }}
              size="sm"
              leftSection={<IconSend size={15} />}
              disabled={!newText.trim()}
            >
              Post Comment
            </Button>
          </Group>
        </Stack>
      </form>

      {/* Existing Comments List */}
      <Stack gap="md">
        {loading ? (
          <Text size="sm" c="dimmed">
            Loading community discussion...
          </Text>
        ) : comments.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            No comments yet. Be the first to start the conversation!
          </Text>
        ) : (
          comments.map((comment) => {
            const isLiked = !!commentLikes[comment.id];
            const likesCount = (comment.likes || 0) + (isLiked ? 1 : 0);

            return (
              <div
                key={comment.id}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.04)"
                }}
              >
                <Group justify="space-between" mb={8} wrap="nowrap">
                  <Group gap="xs">
                    <Avatar src={comment.avatar} size={30} radius="xl" />
                    <div>
                      <Text size="xs" fw={700}>
                        {comment.author}
                      </Text>
                      <Text size="10px" c="dimmed">
                        {comment.date || "Recently"}
                      </Text>
                    </div>
                  </Group>

                  <Group gap={4}>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color={isLiked ? "red" : "gray"}
                      onClick={() => toggleCommentLike(comment.id)}
                      aria-label="Like comment"
                    >
                      {isLiked ? <IconHeartFilled size={14} /> : <IconHeart size={14} />}
                    </ActionIcon>
                    <Text size="11px" c="dimmed">
                      {likesCount}
                    </Text>
                  </Group>
                </Group>

                <Text size="sm" style={{ lineHeight: 1.5, paddingLeft: 40 }}>
                  {comment.content}
                </Text>
              </div>
            );
          })
        )}
      </Stack>
    </Card>
  );
}
