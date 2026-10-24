import React, { useState } from "react";
import {
  Card,
  Grid,
  Text,
  TextInput,
  Button,
  Badge,
  Group,
  useMantineColorScheme
} from "@mantine/core";
import { IconMail, IconCheck, IconSparkles } from "@tabler/icons-react";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <Card
      padding={{ base: "lg", md: "xl" }}
      radius="xl"
      my={40}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 50%, rgba(20, 21, 23, 0.9) 100%)"
          : "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 50%, rgba(248, 250, 252, 0.95) 100%)",
        border: isDark ? "1px solid rgba(99, 102, 241, 0.25)" : "1px solid rgba(99, 102, 241, 0.15)",
        backdropFilter: "blur(16px)"
      }}
    >
      <Grid align="center" gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Group gap="xs" mb={8}>
            <Badge variant="filled" color="indigo" size="sm" leftSection={<IconSparkles size={12} />}>
              Weekly Engineering Digest
            </Badge>
          </Group>

          <Text fw={800} size="xl" style={{ fontSize: "1.65rem", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            Handpicked Insights, Delivered to Your Inbox
          </Text>

          <Text size="sm" c="dimmed" mt={8} style={{ maxWidth: 500 }}>
            Join 32,000+ engineers, designers, and architects receiving our zero-noise weekly synthesis of multi-API articles, architectural deep-dives, and frontend performance tutorials.
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          {subscribed ? (
            <Card padding="md" radius="md" style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <Group gap="xs">
                <IconCheck size={22} color="#10b981" />
                <div>
                  <Text fw={700} size="sm" c="teal">
                    You're Subscribed!
                  </Text>
                  <Text size="xs" c="dimmed">
                    Check your inbox for this week's curated edition.
                  </Text>
                </div>
              </Group>
            </Card>
          ) : (
            <form onSubmit={handleSubscribe}>
              <Group gap="xs" wrap="nowrap">
                <TextInput
                  placeholder="Enter your work email..."
                  type="email"
                  required
                  size="md"
                  radius="md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftSection={<IconMail size={18} stroke={1.5} />}
                  style={{ flex: 1 }}
                />
                <Button
                  type="submit"
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "indigo", to: "violet" }}
                >
                  Join
                </Button>
              </Group>
              <Text size="11px" c="dimmed" mt={6}>
                No spam ever. One-click unsubscribe anytime.
              </Text>
            </form>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );
}
