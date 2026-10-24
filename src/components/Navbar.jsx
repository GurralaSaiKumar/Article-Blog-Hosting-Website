import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Container,
  Group,
  Button,
  TextInput,
  ActionIcon,
  Badge,
  Drawer,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
  Burger,
  rem
} from "@mantine/core";
import {
  IconSearch,
  IconSun,
  IconMoon,
  IconBookmark,
  IconEdit,
  IconSparkles,
  IconHome,
  IconArticle,
  IconInfoCircle,
  IconX
} from "@tabler/icons-react";
import { useApp } from "../context/AppContext";

export default function Navbar({ onOpenWriteModal }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isDark = colorScheme === "dark";
  const { bookmarks, searchQuery, setSearchQuery } = useApp();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: "Home", to: "/", icon: <IconHome size={18} /> },
    { label: "Explore", to: "/articles", icon: <IconArticle size={18} /> },
    {
      label: "Bookmarks",
      to: "/bookmarks",
      icon: <IconBookmark size={18} />,
      badge: bookmarks.length > 0 ? bookmarks.length : null
    },
    { label: "Architecture", to: "/about", icon: <IconInfoCircle size={18} /> }
  ];

  return (
    <>
      <header
        className="glass-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          padding: "12px 0"
        }}
      >
        <Container size="xl">
          <Group justify="space-between" wrap="nowrap">
            {/* Logo */}
            <Group gap="xs" component={Link} to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.35)"
                }}
              >
                <IconSparkles size={20} />
              </div>
              <div>
                <Group gap={6} align="center">
                  <Text fw={800} size="lg" style={{ letterSpacing: "-0.02em" }}>
                    Chronicle
                  </Text>
                </Group>
                <Text size="10px" c="dimmed" style={{ marginTop: -3, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Multi-API Blog Platform
                </Text>
              </div>
            </Group>

            {/* Desktop Navigation Links */}
            <Group gap="sm" visibleFrom="md">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: isActive
                      ? theme.colors.indigo[6]
                      : isDark
                        ? theme.colors.dark[0]
                        : theme.colors.gray[7],
                    backgroundColor: isActive
                      ? isDark
                        ? "rgba(99, 102, 241, 0.15)"
                        : "rgba(99, 102, 241, 0.08)"
                      : "transparent",
                    transition: "all 0.15s ease"
                  })}
                >
                  {item.label}
                  {item.badge !== null && (
                    <Badge size="xs" variant="filled" color="indigo" circle>
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              ))}
            </Group>

            {/* Search, Action Buttons & Theme Toggle */}
            <Group gap="xs" wrap="nowrap">
              {/* Quick Search */}
              <form onSubmit={handleSearchSubmit} style={{ margin: 0 }}>
                <TextInput
                  placeholder="Search articles..."
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
                    root: { width: rem(220) },
                    input: {
                      fontSize: 13,
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                    }
                  }}
                  visibleFrom="sm"
                />
              </form>

              {/* Write Article Button */}
              <Button
                variant="gradient"
                gradient={{ from: "indigo", to: "violet", deg: 90 }}
                size="sm"
                radius="md"
                leftSection={<IconEdit size={16} />}
                onClick={onOpenWriteModal}
                visibleFrom="xs"
              >
                Write
              </Button>

              {/* Theme Toggle */}
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                radius="md"
                onClick={() => toggleColorScheme()}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                aria-label="Toggle theme"
              >
                {isDark ? <IconSun size={18} color="#f59e0b" /> : <IconMoon size={18} color="#4f46e5" />}
              </ActionIcon>

              {/* Mobile Burger */}
              <Burger
                opened={drawerOpened}
                onClick={() => setDrawerOpened((o) => !o)}
                hiddenFrom="md"
                size="sm"
                aria-label="Toggle navigation"
              />
            </Group>
          </Group>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="md"
        padding="md"
        title={
          <Group gap="xs">
            <IconSparkles size={20} color="#4f46e5" />
            <Text fw={700}>Chronicle Navigation</Text>
          </Group>
        }
      >
        <Stack gap="md" mt="md">
          <TextInput
            placeholder="Search all articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<IconSearch size={16} />}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setDrawerOpened(false);
                navigate(`/articles?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
          />

          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "violet" }}
            fullWidth
            leftSection={<IconEdit size={18} />}
            onClick={() => {
              setDrawerOpened(false);
              onOpenWriteModal();
            }}
          >
            Publish New Article
          </Button>

          <Stack gap="xs" mt="sm">
            {navLinks.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                variant="subtle"
                color="gray"
                justify="flex-start"
                fullWidth
                size="md"
                leftSection={item.icon}
                rightSection={
                  item.badge !== null && (
                    <Badge size="xs" color="indigo">
                      {item.badge}
                    </Badge>
                  )
                }
                onClick={() => setDrawerOpened(false)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
