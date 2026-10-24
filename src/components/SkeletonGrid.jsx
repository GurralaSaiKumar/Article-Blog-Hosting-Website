import React from "react";
import { SimpleGrid, Card, Skeleton, Stack, Group } from "@mantine/core";

export default function SkeletonGrid({ count = 6, viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <Stack gap="md">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} padding="md" radius="lg" withBorder style={{ display: "flex", flexDirection: "row", gap: 16 }}>
            <Skeleton height={140} width={220} radius="md" />
            <Stack justify="space-between" style={{ flex: 1 }}>
              <div>
                <Group justify="space-between" mb="xs">
                  <Skeleton height={20} width={80} radius="sm" />
                  <Skeleton height={20} width={50} radius="sm" />
                </Group>
                <Skeleton height={22} width="85%" radius="sm" mb={8} />
                <Skeleton height={14} width="95%" radius="sm" mb={6} />
                <Skeleton height={14} width="70%" radius="sm" />
              </div>
              <Group justify="space-between">
                <Group gap="xs">
                  <Skeleton height={28} circle />
                  <Skeleton height={14} width={100} radius="sm" />
                </Group>
                <Skeleton height={20} width={60} radius="sm" />
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} padding={0} radius="lg" withBorder style={{ overflow: "hidden" }}>
          <Skeleton height={190} radius={0} />
          <Stack p="md" gap="md">
            <div>
              <Group justify="space-between" mb="xs">
                <Skeleton height={14} width={70} radius="sm" />
                <Skeleton height={14} width={60} radius="sm" />
              </Group>
              <Skeleton height={22} width="90%" radius="sm" mb={8} />
              <Skeleton height={14} width="98%" radius="sm" mb={6} />
              <Skeleton height={14} width="75%" radius="sm" />
            </div>
            <Group justify="space-between" pt="xs">
              <Group gap="xs">
                <Skeleton height={28} circle />
                <Skeleton height={14} width={90} radius="sm" />
              </Group>
              <Skeleton height={24} width={50} radius="sm" />
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
