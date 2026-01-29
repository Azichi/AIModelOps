import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { usePromptCtx } from '../PromptContext';
import { useConfirm } from './Confirm';


type SidebarProps = {
  variant?: 'fixed' | 'drawer';
  onNavigate?: () => void;
};

export const Sidebar = ({ variant = 'fixed', onNavigate }: SidebarProps) => {
  const {
    categories,
    selectCategory,
    selectedCategory,
    addCategory,
    deleteCategory,
    editCategory,
  } = usePromptCtx();
  const toast = useToast();
  const { confirm, ConfirmModal } = useConfirm();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  const isSystemCategory = (id: string) =>
    id === '__batch_mode__' || id === '__chain_mode__';

  const handleAdd = async () => {
    const name = prompt('Category name?');
    if (name && name.trim()) addCategory(name.trim());
  };

  const handleEdit = async (id: string, old: string) => {
    const name = prompt('Edit category name:', old);
    if (name && name.trim()) editCategory(id, name.trim());
  };

  const handleDelete = async (id: string) => {
    if (await confirm()) {
      deleteCategory(id);
      toast({ title: 'Category removed.', status: 'success', duration: 1500 });
    }
    

  };

  return (
    <Box
      position={variant === 'fixed' ? 'fixed' : 'relative'}
      left={variant === 'fixed' ? 0 : undefined}
      top={variant === 'fixed' ? 0 : undefined}
      h={variant === 'fixed' ? '100vh' : '100%'}
      w="280px"
      bg="var(--surface)"
      borderRight="1px solid var(--border)"
      display="flex"
      flexDirection="column"
    >
      <Box px={4} pt={5} pb={4}>
        <Button
          w="full"
          onClick={handleAdd}
          variant="subtle"
          leftIcon={<AddIcon />}
        >
          New Category
        </Button>
      </Box>

      <Box flex="1" overflowY="auto" px={2} pb={4}>
        <VStack align="stretch" gap={1}>
          {categories.map((cat) => {
            const isActive = selectedCategory?.id === cat.id;
            const isSystem = isSystemCategory(cat.id);

            return (
              <HStack
                key={cat.id}
                minH="44px"
                px={3}
                py={2}
                borderRadius="10px"
                borderLeft={isActive ? '3px solid var(--accent)' : '3px solid transparent'}
                bg={
                  isActive
                    ? 'var(--surfaceAlt)'
                    : hoveredCategoryId === cat.id
                      ? 'var(--surfaceAlt)'
                      : 'transparent'
                }
                transition="background-color 140ms ease"
                cursor="pointer"
                onMouseLeave={() => setHoveredCategoryId(null)}
                onMouseMove={(e) => {
                  const target = e.target as HTMLElement | null;
                  const inIcon = !!target?.closest('[data-aiops-icon="1"]');
                  const next = inIcon ? null : cat.id;
                  if (hoveredCategoryId !== next) setHoveredCategoryId(next);
                }}
                onClick={() => {
                  selectCategory(cat.id);
                  onNavigate?.();
                }}
              >
                <Text flex="1" fontSize="sm" fontWeight="600" color="var(--textPrimary)">
                  {cat.name}
                </Text>

                {!isSystem ? (
                  <HStack
                    spacing={1}
                    data-aiops-icon="1"
                    onMouseEnter={() => setHoveredCategoryId(null)}
                  >
                    <IconButton
                      aria-label="edit"
                      size="sm"
                      variant="ghost"
                      icon={<EditIcon />}
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
                        handleEdit(cat.id, cat.name);
                      }}
                    />
                    <IconButton
                      aria-label="delete"
                      size="sm"
                      variant="ghost"
                      icon={<DeleteIcon />}
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
                        handleDelete(cat.id);
                      }}
                    />
                  </HStack>
                ) : null}
              </HStack>
            );
          })}
        </VStack>
      </Box>

      <ConfirmModal prompt="Delete category?" />
    </Box>
  );
};
