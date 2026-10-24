import React, { useState } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Stack,
  Text,
  Badge
} from "@mantine/core";
import { IconPencil, IconUpload } from "@tabler/icons-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../api/sampleData";

export default function WriteModal({ opened, onClose }) {
  const { publishArticle } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [tagsStr, setTagsStr] = useState("react, performance, web");
  const [authorName, setAuthorName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");

  const presets = [
    { label: "Tech Architecture", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" },
    { label: "AI & Neural Nets", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" },
    { label: "Design Systems", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80" },
    { label: "Cloud & DevOps", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" }
  ];

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(2, Math.ceil(wordCount / 200));

    const newArticle = {
      title: title.trim(),
      description: content.slice(0, 160) + "...",
      content: content.trim(),
      category: category || "Development",
      tags: tags.length ? tags : ["general"],
      coverImage: coverImage.trim() || presets[0].url,
      author: {
        name: authorName.trim() || "Chronicle Creator",
        username: (authorName.trim() || "creator").toLowerCase().replace(/\s+/g, "_"),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName.trim() || "creator")}`,
        role: "Community Author",
        bio: "Author on Chronicle's multi-source publishing ecosystem."
      },
      readingTime
    };

    publishArticle(newArticle);
    onClose();

    // Reset form
    setTitle("");
    setContent("");
    setAuthorName("");
    setCoverImage("");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconPencil size={20} color="#4f46e5" />
          <Text fw={700} size="lg">
            Publish New Article
          </Text>
        </Group>
      }
      size="xl"
      radius="lg"
      padding="xl"
    >
      <form onSubmit={handlePublish}>
        <Stack gap="md">
          <TextInput
            label="Article Title"
            placeholder="e.g. Modern Frontend Performance Patterns"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Group grow>
            <Select
              label="Primary Category"
              value={category}
              onChange={setCategory}
              data={CATEGORIES.filter((c) => c !== "All").map((c) => ({ value: c, label: c }))}
              required
            />
            <TextInput
              label="Author Name"
              placeholder="Your name or handle"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </Group>

          <TextInput
            label="Tags (comma separated)"
            placeholder="e.g. react, performance, vite, mantine"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />

          <div>
            <TextInput
              label="Cover Image URL"
              placeholder="Paste image URL or pick a preset below"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
            <Group gap={6} mt={6}>
              <Text size="11px" c="dimmed">
                Quick Presets:
              </Text>
              {presets.map((p) => (
                <Badge
                  key={p.label}
                  size="xs"
                  variant="outline"
                  color="indigo"
                  style={{ cursor: "pointer" }}
                  onClick={() => setCoverImage(p.url)}
                >
                  {p.label}
                </Badge>
              ))}
            </Group>
          </div>

          <Textarea
            label="Article Content (Markdown supported)"
            placeholder="Write your story using markdown headers, paragraphs, and code blocks..."
            minRows={8}
            maxRows={16}
            autosize
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "indigo", to: "violet" }}
              leftSection={<IconUpload size={16} />}
            >
              Publish to Platform
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
