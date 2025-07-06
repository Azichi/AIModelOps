import {
  Box,
  SimpleGrid,
  Text,
  Button,
  IconButton,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { usePromptCtx } from '../PromptContext';
import { useConfirm } from './Confirm';

export const PromptCards = () => {
  const {
    selectedCategory,
    addPrompt,
    editPrompt,
    deletePrompt,
    selectPrompt,
  } = usePromptCtx();
  const toast = useToast();
  const { confirm, ConfirmModal } = useConfirm();

  if (!selectedCategory)
    return <Box color='white.500'>No category selected.</Box>;

  const handleAdd = () => {
    const name = prompt('Prompt name?');
    if (!name || !name.trim()) return;
    const template = prompt('Full prompt template (use {var}):', '');
    if (template) {
      addPrompt(selectedCategory.id, {
        name: name.trim(),
        description: '',
        template,
        variables: Array.from(template.matchAll(/{(\w+)}/g)).map(m => ({
          key: m[1],
          placeholder: '',
        })),
      });
    }
  };

  const handleEdit = (pId: string) => {
    const p = selectedCategory.prompts.find(p => p.id === pId);
    if (!p) return;
    const name = prompt('Edit prompt name:', p.name);
    if (name && name.trim())
      editPrompt(selectedCategory.id, { ...p, name: name.trim() });
  };

  const handleDelete = async (pId: string) => {
    if (await confirm()) {
      deletePrompt(selectedCategory.id, pId);
      toast({ title: 'Prompt deleted.', status: 'success', duration: 1500 });
    }
  };

  return (
    <Box>
      <HStack mb={4}>
        <Text fontSize='2xl' flex='1'>
          {selectedCategory.name}
        </Text>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="white"
        variant="ghost"
        onClick={handleAdd}
        _hover={{
          bg: 'whiteAlpha.300',
          transition: 'background 0.2s ease'
        }}
      >
        New Prompt
      </Button>

      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {selectedCategory.prompts.map(p => (
          <Box
            key={p.id}
            bg='#1a1a1a'
            p={5}
            borderRadius='lg'
            _hover={{ boxShadow: '0 0 0 1px #333' }}
          >
            <VStack align='start' gap={3}>
              <Text fontWeight='bold' fontSize='lg'>
                {p.name}
              </Text>
              <Text color='white.400' fontSize='sm'>
                {p.description}
              </Text>
              <HStack w='full' justify='flex-end'>
                <Button
                  size='sm'
                  variant='ghost'
                  color='white'
                  borderColor='white'
                  _hover={{
                    bg: 'whiteAlpha.300',
                    transform: 'scale(1.02)',
                    transition: 'all 0.15s ease-in-out', 
                  }}
                  onClick={() => selectPrompt(p.id)}
                >
                  Open
                </Button>
                <IconButton
                  aria-label='edit'
                  icon={<EditIcon />}
                  size='sm'
                  variant='ghost'
                  color='white'
                  borderColor='white'
                  _hover={{
                    bg: 'whiteAlpha.300',
                    transform: 'scale(1.02)',
                    transition: 'all 0.15s ease-in-out', 
                  }}

                  onClick={() => handleEdit(p.id)}
                />
                <IconButton
                  aria-label='del'
                  icon={<DeleteIcon />}
                  size='sm'
                  variant='ghost'
                  color='white'
                  borderColor='white'
                  _hover={{
                    bg: 'whiteAlpha.300',
                    transform: 'scale(1.02)',
                    transition: 'all 0.15s ease-in-out',  
                  }}

                  onClick={() => handleDelete(p.id)}
                />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
      <ConfirmModal prompt='Delete prompt?' />
    </Box>
  );
};
