import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Badge,
  Card,
  Grid,
  SimpleGrid,
  Group,
  Stack,
  Button,
  Divider,
  useMantineColorScheme
} from "@mantine/core";
import {
  IconApiApp,
  IconBolt,
  IconCheck,
  IconRefresh,
  IconLayersLinked,
  IconCpu
} from "@tabler/icons-react";
import { checkApiHealth } from "../api/apiService";

export default function AboutPage() {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(true);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const runHealthCheck = async () => {
    setChecking(true);
    const res = await checkApiHealth();
    setHealth(res);
    setChecking(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <Group gap="xs" mb={6}>
          <IconCpu size={20} color="#4f46e5" />
          <Text size="xs" fw={700} c="indigo" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Technical Architecture & Documentation
          </Text>
        </Group>
        <Title order={1} style={{ letterSpacing: "-0.03em" }}>
          System Design, Multi-API Pipeline & Optimisations
        </Title>
        <Text size="md" c="dimmed" mt={8} style={{ maxWidth: 760, lineHeight: 1.6 }}>
          Chronicle is built from the ground up to showcase modern React 19 architecture, Mantine CSS design tokens, resilient multi-endpoint data aggregation, and real-time performance engineering.
        </Text>
      </div>

      {/* Live API Health & Latency Dashboard */}
      <Card
        padding="xl"
        radius="lg"
        mb={36}
        style={{
          backgroundColor: isDark ? "rgba(26, 27, 30, 0.75)" : "rgba(255, 255, 255, 0.95)",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)"
        }}
      >
        <Group justify="space-between" mb="lg">
          <div>
            <Title order={3}>Live API Endpoints & Health Monitor</Title>
            <Text size="xs" c="dimmed">
              Real-time ping latency and connectivity verification across external providers
            </Text>
          </div>
          <Button
            size="xs"
            variant="light"
            color="indigo"
            leftSection={<IconRefresh size={14} className={checking ? "animate-spin" : ""} />}
            onClick={runHealthCheck}
            disabled={checking}
          >
            {checking ? "Pinging..." : "Check Endpoints"}
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {/* Dev.to API card */}
          <Card padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconApiApp size={18} color="#4f46e5" />
                <Text fw={700} size="sm">
                  Dev.to REST Articles API
                </Text>
              </Group>
              <Badge color={health?.devto?.status === "healthy" ? "teal" : "yellow"} size="xs">
                {health?.devto?.status || "Checking..."}
              </Badge>
            </Group>
            <Text size="11px" c="dimmed" style={{ fontFamily: "monospace" }}>
              https://dev.to/api/articles?per_page=16
            </Text>
            <Divider my="xs" opacity={0.1} />
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Roundtrip Latency:
              </Text>
              <Text size="xs" fw={700} c="indigo">
                {health?.devto?.latencyMs ? `${health.devto.latencyMs} ms` : "Measuring..."}
              </Text>
            </Group>
          </Card>

          {/* DummyJSON API card */}
          <Card padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconApiApp size={18} color="#06b6d4" />
                <Text fw={700} size="sm">
                  DummyJSON Posts & Users API
                </Text>
              </Group>
              <Badge color={health?.dummyjson?.status === "healthy" ? "teal" : "yellow"} size="xs">
                {health?.dummyjson?.status || "Checking..."}
              </Badge>
            </Group>
            <Text size="11px" c="dimmed" style={{ fontFamily: "monospace" }}>
              https://dummyjson.com/posts?limit=16
            </Text>
            <Divider my="xs" opacity={0.1} />
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                Roundtrip Latency:
              </Text>
              <Text size="xs" fw={700} c="indigo">
                {health?.dummyjson?.latencyMs ? `${health.dummyjson.latencyMs} ms` : "Measuring..."}
              </Text>
            </Group>
          </Card>
        </SimpleGrid>
      </Card>

      {/* Multi-API Ingestion Architecture Breakdown */}
      <Grid gutter="xl" mb={40}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card padding="xl" radius="lg" withBorder style={{ height: "100%" }}>
            <Group gap="xs" mb="sm">
              <IconLayersLinked size={22} color="#4f46e5" />
              <Title order={3}>Multi-API Aggregation Pipeline</Title>
            </Group>
            <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.6 }}>
              Instead of relying on a single static endpoint, Chronicle integrates multiple external content sources concurrently using an asynchronous client-side pipeline:
            </Text>
            <Stack gap="sm">
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>Dev.to Articles API:</strong> Ingests high-quality developer writeups, reading times, tags, and authentic reaction metrics.
                </Text>
              </Group>
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>DummyJSON Posts & Users API:</strong> Contributes community blog entries joined dynamically with author avatars and profile data.
                </Text>
              </Group>
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>Chronicle Unified Schema:</strong> A deterministic mapper converts heterogeneous payloads into a unified <code>Article</code> object model.
                </Text>
              </Group>
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>Offline Resilience & Seed Cache:</strong> Fallback dataset guarantees zero blank-screen failures if network rate-limits occur.
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Performance Optimisations Col */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card padding="xl" radius="lg" withBorder style={{ height: "100%" }}>
            <Group gap="xs" mb="sm">
              <IconBolt size={22} color="#f59e0b" />
              <Title order={3}>Frontend Performance Optimisations</Title>
            </Group>
            <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.6 }}>
              Key performance engineering techniques implemented across the platform to ensure high speed and responsive user interaction:
            </Text>
            <Stack gap="sm">
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>In-Memory Cache with TTL:</strong> Aggregated endpoints and article details are cached in memory (5-minute TTL) for instantaneous sub-10ms navigation.
                </Text>
              </Group>
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>Debounced Live Search & Memoization:</strong> Input keystrokes are processed with React <code>useMemo</code>, eliminating unnecessary recalculations.
                </Text>
              </Group>
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>Skeleton Placeholders:</strong> Mantine <code>Skeleton</code> mimics cards to minimize cognitive wait perception and prevent Cumulative Layout Shift (CLS).
                </Text>
              </Group>
              <Group align="flex-start" gap="xs">
                <IconCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="xs">
                  <strong>Hardware Accelerated Scroll:</strong> The reading progress tracker is throttled via <code>requestAnimationFrame</code> for butter-smooth 60fps scrolling.
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
