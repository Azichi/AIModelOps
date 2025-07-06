import {
  Box,
  Heading,
  Input,
  VStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { usePromptCtx } from '../PromptContext';
import { useState } from 'react';

export const PromptForm = () => {
  const { selectedPrompt } = usePromptCtx();
  const toast = useToast();
  const [vars, setVars] = useState<Record<string, string>>({});

  if (!selectedPrompt) return null;

  const filled = selectedPrompt.template.replace(/{(\w+)}/g, (_, k) =>
    vars[k] ?? '',
  );

  const copy = async () => {
    await navigator.clipboard.writeText(filled);
    toast({
      title: 'Prompt copied',
      status: 'success',
      duration: 1500,
    });
  };

  return (
    <Box
      position='fixed'
      right={0}
      top={0}
      h='100vh'
      w='400px'
      bg='#111'
      borderLeft='1px solid #222'
      p={6}
      overflowY='auto'
    >
      <Heading size='md' mb={6}>
        {selectedPrompt.name}
      </Heading>
      <VStack align='stretch' gap={4}>
      {selectedPrompt.variables.map(v => (
        <Input
          key={v.key}
          placeholder={v.placeholder || v.key}
          value={vars[v.key] ?? ''}
          onChange={e => setVars({ ...vars, [v.key]: e.target.value })}
          colorScheme="white"
          sx={{
            '::placeholder': {
              color: 'white',
              opacity: 0.25,
            },
          }}
          _hover={{ borderColor: 'whiteAlpha.400' }}
          _focus={{ borderColor: 'whiteAlpha.600', boxShadow: 'none' }}
        />
      ))}
      </VStack>
      <Button
        colorScheme="white"
        variant="ghost"
        _hover={{
          bg: 'whiteAlpha.300',
          transition: 'background 0.2s ease'
        }}
        mt={6}
        disabled={Object.values(vars).some(v => !v.trim())}
        onClick={copy}
      >
        Copy to Clipboard
      </Button>
    </Box>
  );
};
