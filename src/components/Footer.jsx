import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Text,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Divider,
  useMantineColorScheme
} from "@mantine/core";
import {
  IconSparkles,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconApiApp
} from "@tabler/icons-react";
import { CATEGORIES } from "../api/sampleData";

export default function Footer() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <footer
      style={{
        marginTop: 60,
        backgroundColor: isDark ? "rgba(15, 16, 18, 0.95)" : "rgba(248, 250, 252, 0.95)",
        borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
        paddingTop: 50,
        paddingBottom: 30
      }}
    >
      <Container size="xl">
        <Grid gutter="xl">
          {/* Brand Col */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Group gap="xs" mb="sm">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}
              >
                <IconSparkles size={18} />
              </div>
              <Text fw={800} size="lg">
                Chronicle
              </Text>
            </Group>

            <Text size="sm" c="dimmed" style={{ maxWidth: 360, lineHeight: 1.6 }}>
              A high-performance modern Article & Blog Hosting platform. Designed to demonstrate enterprise UI/UX design, Mantine CSS styling, multi-API real-time aggregation, and frontend performance engineering.
            </Text>

            <Group gap="xs" mt="md">
              <Badge variant="outline" color="indigo" size="xs">
                Mantine v7 / CSS
              </Badge>
              <Badge variant="outline" color="cyan" size="xs">
                React Router v7
              </Badge>
              <Badge variant="outline" color="violet" size="xs">
                Multi-API
              </Badge>
            </Group>
          </Grid.Col>

          {/* Quick Nav Col */}
          <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
            <Text fw={700} size="sm" mb="sm">
              Navigation
            </Text>
            <Stack gap={8}>
              <Text component={Link} to="/" size="xs" c="dimmed" style={{ textDecoration: "none" }}>
                Home Spotlight
              </Text>
              <Text component={Link} to="/articles" size="xs" c="dimmed" style={{ textDecoration: "none" }}>
                All Articles
              </Text>
              <Text component={Link} to="/bookmarks" size="xs" c="dimmed" style={{ textDecoration: "none" }}>
                Reading List
              </Text>
              <Text component={Link} to="/about" size="xs" c="dimmed" style={{ textDecoration: "none" }}>
                Architecture & APIs
              </Text>
            </Stack>
          </Grid.Col>

          {/* Categories Col */}
          <Grid.Col span={{ base: 6, sm: 3, md: 2 }}>
            <Text fw={700} size="sm" mb="sm">
              Categories
            </Text>
            <Stack gap={8}>
              {CATEGORIES.slice(1, 6).map((c) => (
                <Text
                  key={c}
                  component={Link}
                  to={`/articles?category=${encodeURIComponent(c)}`}
                  size="xs"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                >
                  {c}
                </Text>
              ))}
            </Stack>
          </Grid.Col>

          {/* API Integrations Col */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Text fw={700} size="sm" mb="sm">
              Connected APIs
            </Text>
            <Stack gap={8}>
              <Group gap={6}>
                <IconApiApp size={14} color="#4f46e5" />
                <Text size="xs" c="dimmed">
                  Dev.to REST Articles API
                </Text>
              </Group>
              <Group gap={6}>
                <IconApiApp size={14} color="#06b6d4" />
                <Text size="xs" c="dimmed">
                  DummyJSON Posts & Users API
                </Text>
              </Group>
              <Group gap={6}>
                <IconApiApp size={14} color="#10b981" />
                <Text size="xs" c="dimmed">
                  In-Memory TTL Caching Engine
                </Text>
              </Group>
              <Group gap={6}>
                <IconApiApp size={14} color="#f59e0b" />
                <Text size="xs" c="dimmed">
                  Chronicle Creator Local Storage
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" opacity={0.1} />

        <Group justify="space-between" wrap="wrap">
          <Text size="xs" c="dimmed">
            © 2026 Chronicle Publishing Platform. Built with React, Mantine CSS, and React Router.
          </Text>

          <Group gap="xs">
            <ActionIcon size="sm" variant="subtle" color="gray" component="a" href="https://github.com" target="_blank">
              <IconBrandGithub size={16} />
            </ActionIcon>
            <ActionIcon size="sm" variant="subtle" color="gray" component="a" href="https://twitter.com" target="_blank">
              <IconBrandTwitter size={16} />
            </ActionIcon>
            <ActionIcon size="sm" variant="subtle" color="gray" component="a" href="https://linkedin.com" target="_blank">
              <IconBrandLinkedin size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
