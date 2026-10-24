import React from "react";
import { Card, SimpleGrid, Text, Group, useMantineColorScheme } from "@mantine/core";
import {
  IconBooks,
  IconUsers,
  IconApiApp,
  IconBolt
} from "@tabler/icons-react";

export default function StatsBanner() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const stats = [
    { label: "Articles Hosted", value: "2,480+", icon: <IconBooks size={22} color="#4f46e5" />, note: "Synced across sources" },
    { label: "Active Contributors", value: "650+", icon: <IconUsers size={22} color="#7c3aed" />, note: "Global engineers & designers" },
    { label: "Live API Feeds", value: "3 Sources", icon: <IconApiApp size={22} color="#06b6d4" />, note: "Dev.to + DummyJSON + Local" },
    { label: "P99 Load Time", value: "< 140ms", icon: <IconBolt size={22} color="#10b981" />, note: "In-memory cached" }
  ];

  return (
    <Card
      padding="lg"
      radius="lg"
      my={36}
      style={{
        backgroundColor: isDark ? "rgba(26, 27, 30, 0.6)" : "rgba(248, 250, 252, 0.8)",
        backdropFilter: "blur(12px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)"
      }}
    >
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
        {stats.map((s, idx) => (
          <Group key={idx} gap="md" wrap="nowrap">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(79, 70, 229, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {s.icon}
            </div>
            <div>
              <Text fw={800} size="xl" style={{ letterSpacing: "-0.02em" }}>
                {s.value}
              </Text>
              <Text size="xs" fw={600} c={isDark ? "gray.4" : "gray.7"}>
                {s.label}
              </Text>
              <Text size="11px" c="dimmed">
                {s.note}
              </Text>
            </div>
          </Group>
        ))}
      </SimpleGrid>
    </Card>
  );
}
