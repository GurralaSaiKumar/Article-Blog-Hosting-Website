import React from "react";
import {
  Group,
  TextInput,
  Select,
  SegmentedControl,
  Badge,
  ActionIcon,
  Text,
  useMantineColorScheme,
  rem
} from "@mantine/core";
import {
  IconSearch,
  IconLayoutGrid,
  IconList,
  IconX,
  IconSortDescending
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../api/sampleData";

export default function FilterBar({ totalCount = 0 }) {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    resetFilters
  } = useApp();

  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const hasActiveFilters = selectedCategory !== "All" || selectedTag || searchQuery.trim() !== "";

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 8,
          marginBottom: 16,
          scrollbarWidth: "none"
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="tag-pill"
              style={{
                border: "none",
                outline: "none",
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: isSelected
                  ? "#4f46e5"
                  : isDark
                  ? "rgba(255, 255, 255, 0.06)"
                  : "rgba(0, 0, 0, 0.05)",
                color: isSelected
                  ? "#ffffff"
                  : isDark
                  ? "#c1c2c5"
                  : "#4b5563",
                boxShadow: isSelected ? "0 4px 12px rgba(79, 70, 229, 0.35)" : "none"
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Tag Pill, Sort & View Mode */}
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        {/* Left: Search input & Active Filters */}
        <Group gap="xs" style={{ flex: 1, minWidth: 260 }}>
          <TextInput
            placeholder="Search titles, authors, keywords..."
            size="sm"
            radius="md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            rightSection={
              searchQuery ? (
                <ActionIcon size="xs" variant="subtle" color="gray" onClick={() => setSearchQuery("")}>
                  <IconX size={12} />
                </ActionIcon>
              ) : null
            }
            styles={{
              root: { width: "100%", maxWidth: rem(340) },
              input: {
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
              }
            }}
          />

          {/* Active Tag filter if selected */}
          {selectedTag && (
            <Badge
              size="lg"
              variant="light"
              color="indigo"
              rightSection={
                <ActionIcon size="xs" variant="transparent" color="indigo" onClick={() => setSelectedTag("")}>
                  <IconX size={12} />
                </ActionIcon>
              }
            >
              Tag: #{selectedTag}
            </Badge>
          )}

          {hasActiveFilters && (
            <Badge
              size="md"
              variant="outline"
              color="red"
              style={{ cursor: "pointer" }}
              onClick={resetFilters}
            >
              Reset Filters
            </Badge>
          )}
        </Group>

        {/* Right: Results Count, Sort dropdown & Grid/List view switcher */}
        <Group gap="sm" wrap="nowrap">
          <Text size="xs" c="dimmed" visibleFrom="sm">
            {totalCount} {totalCount === 1 ? "article" : "articles"}
          </Text>

          <Select
            size="sm"
            radius="md"
            value={sortBy}
            onChange={setSortBy}
            data={[
              { value: "trending", label: "Trending First" },
              { value: "newest", label: "Newest Published" },
              { value: "mostLiked", label: "Most Liked" },
              { value: "readTime", label: "Quick Reads (< 5 min)" }
            ]}
            leftSection={<IconSortDescending size={16} stroke={1.5} />}
            styles={{
              root: { width: rem(180) },
              input: {
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                fontSize: 13
              }
            }}
          />

          <SegmentedControl
            size="xs"
            radius="md"
            value={viewMode}
            onChange={setViewMode}
            data={[
              {
                value: "grid",
                label: (
                  <Group gap={4} p={2} justify="center">
                    <IconLayoutGrid size={15} />
                  </Group>
                )
              },
              {
                value: "list",
                label: (
                  <Group gap={4} p={2} justify="center">
                    <IconList size={15} />
                  </Group>
                )
              }
            ]}
          />
        </Group>
      </Group>
    </div>
  );
}
