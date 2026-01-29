import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  HStack,
  IconButton,
  Heading,
  Spacer,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, HamburgerIcon } from "@chakra-ui/icons";

import { usePromptCtx } from "../PromptContext";
import { Sidebar } from "./Sidebar";
import { BatchModePage } from "./BatchModePage";
import { ChainModePage } from "./ChainModePage";
import { CategoryPage } from "./CategoryPage";
import { PromptDrawer } from "./PromptDrawer";

export function AppShell() {
  const { selectedCategory, addPrompt } = usePromptCtx();
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isBatch = selectedCategory?.id === "__batch_mode__";
  const isChain = selectedCategory?.id === "__chain_mode__";
  const isCategory = !!selectedCategory && !isBatch && !isChain;

  return (
    <Box bg="var(--background)" color="var(--textPrimary)" minH="100vh">
      {isMobile ? (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
          <DrawerOverlay bg="rgba(0,0,0,0.55)" />
          <DrawerContent
            bg="var(--surface)"
            borderRight="1px solid var(--border)"
            maxW="280px"
            w="280px"
          >
            <DrawerBody p={0}>
              <Sidebar variant="drawer" onNavigate={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sidebar />
      )}

      <Box ml={{ base: 0, md: "280px" }}>
        <Box
          position="sticky"
          top={0}
          zIndex={1}
          bg="var(--background)"
          borderBottom="1px solid var(--border)"
        >
          <Box maxW="1200px" mx="auto" px="24px" py="16px">
            <HStack spacing={3} align="center">
              {isMobile ? (
                <IconButton
                  aria-label="Open menu"
                  icon={<HamburgerIcon />}
                  variant="ghost"
                  onClick={onOpen}
                  color="var(--textPrimary)"
                  _hover={{ bg: "var(--surfaceAlt)" }}
                  _active={{ bg: "var(--surfaceAlt)" }}
                />
              ) : null}
              <Box>
                <Heading size="md">
                  {isBatch
                    ? "Batch Mode"
                    : isChain
                      ? "Chain Mode"
                      : selectedCategory?.name || "AIModelOps"}
                </Heading>
                <Text fontSize="sm" color="var(--textMuted)" mt={1}>
                  {isBatch
                    ? "Run a batch prompt and review logs/results."
                    : isChain
                      ? "Select a chain template to view details and run it."
                      : "Browse prompts by category and run them."}
                </Text>
              </Box>

              <Spacer />

              {isCategory ? (
                <Button
                  leftIcon={<AddIcon />}
                  variant="subtle"
                  onClick={() => {
                    const name = window.prompt("Prompt name?");
                    if (!name || !name.trim()) return;
                    const template = window.prompt(
                      "Full prompt template (use {var}):",
                      "",
                    );
                    if (!template) return;
                    addPrompt(selectedCategory.id, {
                      name: name.trim(),
                      description: "",
                      template,
                      variables: Array.from(
                        template.matchAll(/{(\w+)}/g),
                      ).map((m) => ({
                        key: m[1],
                        placeholder: "",
                      })),
                    });
                  }}
                >
                  New Prompt
                </Button>
              ) : null}
            </HStack>
          </Box>
        </Box>

        <Box maxW="1200px" mx="auto" px="24px" py="24px">
          {isBatch ? (
            <BatchModePage />
          ) : isChain ? (
            <ChainModePage />
          ) : isCategory ? (
            <CategoryPage />
          ) : null}
        </Box>
      </Box>

      <PromptDrawer />
    </Box>
  );
}
