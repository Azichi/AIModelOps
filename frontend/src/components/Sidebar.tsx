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
import { usePromptCtx } from '../PromptContext';
import { useConfirm } from './Confirm';

export const Sidebar = () => {
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
      position='fixed'
      left={0}
      top={0}
      h='100vh'
      w='240px'
      bg='#151515'
      px={4}
      py={6}
      borderRight='1px solid #222'
    >
      <Button
        w='full'
        mb={6}
        onClick={handleAdd}
        colorScheme="white"
        variant="ghost"
        _hover={{
          bg: 'whiteAlpha.300',
          transition: 'background 0.2s ease'
        }}
        leftIcon={<AddIcon />}
      >
        New Category
      </Button>

      <VStack align='stretch' gap={3}>
        {categories.map(cat => (
          <HStack
            key={cat.id}
            p={2}
            borderRadius='md'
            bg={selectedCategory?.id === cat.id ? '#1e1e1e' : undefined}
            _hover={{ bg: '#252525', cursor: 'pointer' }}
            onClick={() => selectCategory(cat.id)}
          >
            <Text flex='1'>{cat.name}</Text>
            <IconButton
              aria-label='edit'
              size='sm'
              variant='ghost'
              color='white'
              _hover={{
                bg: 'whiteAlpha.300',
                transform: 'scale(1.02)',
                transition: 'all 0.15s ease-in-out', 
              }}
              colorScheme='white'
              icon={<EditIcon />}
              onClick={e => {
                e.stopPropagation();
                handleEdit(cat.id, cat.name);
              }}
            />
            <IconButton
              aria-label='delete'
              size='sm'
              variant='ghost'
              color='white'
              _hover={{
                bg: 'whiteAlpha.300',
                transform: 'scale(1.02)',
                transition: 'all 0.15s ease-in-out', 
              }}
              icon={<DeleteIcon />}
              onClick={e => {
                e.stopPropagation();
                handleDelete(cat.id);
              }}
            />
          </HStack>
        ))}
      </VStack>
      <ConfirmModal prompt='Delete category?' />
    </Box>
  );
};
