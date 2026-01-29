import { Box, Button, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { usePromptCtx } from '../PromptContext';
import { Chain } from '../types';
import { PanelCard } from './PanelCard';

function isChain(p: unknown): p is Chain {
  return typeof p === 'object' && !!p && 'chainFile' in (p as any);
}

export function ChainModePage() {
  const { selectedCategory, selectPrompt } = usePromptCtx();

  const chains =
    selectedCategory?.id === '__chain_mode__'
      ? (selectedCategory.prompts as unknown[]).filter(isChain)
      : [];

  if (chains.length === 0) {
    return (
      <PanelCard>
        <Text color="var(--textMuted)" fontSize="sm">
          No chain templates available yet.
        </Text>
      </PanelCard>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
      {chains.map((c) => (
        <PanelCard
          key={c.id}
          borderColor="var(--border)"
          _hover={{ bg: 'var(--surfaceAlt)', borderColor: 'var(--border)' }}
        >
          <VStack align="stretch" spacing={3}>
            <Box>
              <Text fontSize="md" fontWeight="700" color="var(--textPrimary)">
                {c.name}
              </Text>
              <Text fontSize="sm" color="var(--textMuted)" mt={1}>
                {c.description || 'Chain template'}
              </Text>
            </Box>

            <Button
              alignSelf="flex-start"
              variant="subtle"
              onClick={() => selectPrompt(c)}
            >
              Open
            </Button>
          </VStack>
        </PanelCard>
      ))}
    </SimpleGrid>
  );
}
