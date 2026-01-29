import {
  Box,
  Button,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { usePromptCtx } from '../PromptContext';
import { useConfirm } from './Confirm';
import { PanelCard } from './PanelCard';
import { Prompt } from '../types';

function isPrompt(p: unknown): p is Prompt {
  return typeof p === 'object' && !!p && 'template' in (p as any) && 'variables' in (p as any);
}

export function CategoryPage() {
  const {
    selectedCategory,
    selectedPrompt,
    selectPrompt,
    addPrompt,
    editPrompt,
    deletePrompt,
  } = usePromptCtx();
  const toast = useToast();
  const { confirm, ConfirmModal } = useConfirm();
  const [hoveredPromptId, setHoveredPromptId] = useState<string | null>(null);

  if (
    !selectedCategory ||
    selectedCategory.id === '__batch_mode__' ||
    selectedCategory.id === '__chain_mode__'
  ) {
    return null;
  }

  const prompts = (selectedCategory.prompts as unknown[]).filter(isPrompt);

  const selected = isPrompt(selectedPrompt) ? selectedPrompt : null;

  const createPrompt = () => {
    const name = window.prompt('Prompt name?');
    if (!name || !name.trim()) return;
    const template = window.prompt('Full prompt template (use {var}):', '');
    if (!template) return;
    addPrompt(selectedCategory.id, {
      name: name.trim(),
      description: '',
      template,
      variables: Array.from(template.matchAll(/{(\w+)}/g)).map((m) => ({
        key: m[1],
        placeholder: '',
      })),
    });
  };

  const handleEdit = (pId: string) => {
    const p = prompts.find((x) => x.id === pId);
    if (!p) return;
    const name = window.prompt('Edit prompt name:', p.name);
    if (name && name.trim()) editPrompt(selectedCategory.id, { ...p, name: name.trim() });
  };

  const handleDelete = async (pId: string) => {
    if (!(await confirm())) return;
    deletePrompt(selectedCategory.id, pId);
    toast({ title: 'Prompt deleted.', status: 'success', duration: 1500 });
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} alignItems="start">
        <PanelCard>
          <HStack justify="space-between" mb={3}>
            <Text fontSize="sm" fontWeight="700" color="var(--textPrimary)">
              Prompts
            </Text>
            {prompts.length === 0 ? (
              <Button
                size="sm"
                variant="subtle"
                onClick={createPrompt}
              >
                New Prompt
              </Button>
            ) : null}
          </HStack>

          {prompts.length === 0 ? (
            <Box>
              <Text color="var(--textMuted)" fontSize="sm">
                No prompts in this category.
              </Text>
              <Button
                mt={3}
                variant="subtle"
                onClick={createPrompt}
              >
                Create your first prompt
              </Button>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {prompts.map((p) => (
                <PanelCard
                  key={p.id}
                  p={4}
                  borderColor="var(--border)"
                  bg={hoveredPromptId === p.id ? 'var(--surfaceAlt)' : 'var(--surface)'}
                  transition="background-color 140ms ease, border-color 140ms ease"
                  cursor="pointer"
                  onMouseLeave={() => setHoveredPromptId(null)}
                  onMouseMove={(e) => {
                    const target = e.target as HTMLElement | null;
                    const inIcon = !!target?.closest('[data-aiops-icon="1"]');
                    const next = inIcon ? null : p.id;
                    if (hoveredPromptId !== next) setHoveredPromptId(next);
                  }}
                  onClick={() => selectPrompt(p)}
                >
                  <VStack align="stretch" spacing={3}>
                    <Box>
                      <Text fontWeight="700" color="var(--textPrimary)">
                        {p.name}
                      </Text>
                      <Text fontSize="sm" color="var(--textMuted)" mt={1} noOfLines={2}>
                        {p.description || 'Prompt'}
                      </Text>
                    </Box>

                    <HStack justify="space-between">
                      <Box />
                      <HStack
                        spacing={1}
                        data-aiops-icon="1"
                        onMouseEnter={() => setHoveredPromptId(null)}
                      >
                        <IconButton
                          aria-label="edit"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          color="var(--textPrimary)"
                          _hover={{
                            bg: 'var(--surfaceAlt)',
                            boxShadow: '0 0 0 1px var(--border)',
                          }}
                          _active={{
                            bg: 'var(--surfaceAlt)',
                            boxShadow: '0 0 0 1px var(--border)',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(p.id);
                          }}
                        />
                        <IconButton
                          aria-label="delete"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          color="var(--textPrimary)"
                          _hover={{
                            bg: 'var(--surfaceAlt)',
                            boxShadow: '0 0 0 1px var(--border)',
                          }}
                          _active={{
                            bg: 'var(--surfaceAlt)',
                            boxShadow: '0 0 0 1px var(--border)',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id);
                          }}
                        />
                      </HStack>
                    </HStack>
                  </VStack>
                </PanelCard>
              ))}
            </SimpleGrid>
          )}
        </PanelCard>

        <PanelCard>
          <Text fontSize="sm" fontWeight="700" color="var(--textPrimary)" mb={3}>
            Selected Prompt
          </Text>
          {!selected ? (
            <Box>
              <Text color="var(--textMuted)" fontSize="sm">
                No prompt selected.
              </Text>
              <Text color="var(--textMuted)" fontSize="sm" mt={2}>
                Select a prompt to see an overview and examples.
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="700" color="var(--textPrimary)">
                  {selected.name}
                </Text>
                <Text fontSize="sm" color="var(--textMuted)" mt={1}>
                  {selected.description || 'Prompt overview'}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                  Variables
                </Text>
                {selected.variables.length === 0 ? (
                  <Text color="var(--textMuted)" fontSize="sm">
                    No variables.
                  </Text>
                ) : (
                  <VStack align="stretch" spacing={2}>
                    {selected.variables.map((v) => (
                      <HStack
                        key={v.key}
                        justify="space-between"
                        bg="var(--surfaceAlt)"
                        border="1px solid var(--border)"
                        borderRadius="10px"
                        px={3}
                        py={2}
                      >
                        <Text fontSize="sm" color="var(--textPrimary)">
                          {v.key}
                        </Text>
                        <Text fontSize="xs" color="var(--textMuted)">
                          {v.placeholder || 'n/a'}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                  Template Preview
                </Text>
                <Box
                  bg="var(--surfaceAlt)"
                  border="1px solid var(--border)"
                  borderRadius="10px"
                  p={4}
                  fontFamily="mono"
                  fontSize="sm"
                  color="var(--textPrimary)"
                  whiteSpace="pre-wrap"
                >
                  {selected.template}
                </Box>
              </Box>
            </VStack>
          )}
        </PanelCard>
      </SimpleGrid>

      <ConfirmModal prompt="Delete prompt?" />
    </Box>
  );
}
