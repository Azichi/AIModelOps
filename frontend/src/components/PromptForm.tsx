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
import { Prompt, Chain } from '../types';


const CHAIN_MODE_ID = '__chain_mode__';

export const PromptForm = () => {
  const { selectedPrompt, selectedCategory } = usePromptCtx();
  const toast = useToast();
  const [vars, setVars] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chainInput, setChainInput] = useState('');

  if (!selectedPrompt) return null;
  
  function isChain(p: any): p is Chain {
    return typeof p === 'object' && !!p && 'chainFile' in p;
  }

  const isChainMode = selectedCategory?.id === CHAIN_MODE_ID;

  if (!selectedPrompt) return null;

  const chainPrompt = isChainMode && isChain(selectedPrompt) ? selectedPrompt : null;
  const normalPrompt = !isChainMode && !isChain(selectedPrompt) ? selectedPrompt as Prompt : null;


  const filled = normalPrompt
    ? normalPrompt.template.replace(/{(\w+)}/g, (_, k) => vars[k] ?? '')
    : '';

  const copy = async () => {
    await navigator.clipboard.writeText(filled);
    toast({
      title: 'Prompt copied',
      status: 'success',
      duration: 1500,
    });
  };

  const runPrompt = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('http://localhost:8000/run-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_id: normalPrompt?.id,
          variables: vars,
        }),
      });
      const data = await res.json();
      setOutput(data.output || '');
    } catch (e) {
      setOutput('Error');
    }
    setLoading(false);
  };

  const runChain = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('http://localhost:8000/run-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain_file: chainPrompt?.chainFile,
          message: chainInput,
          model: 'gpt-4o',
        }),
      });
      const data = await res.json();
      setOutput(data.output || '');
    } catch (e) {
      setOutput('Error');
    }
    setLoading(false);
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
      {isChainMode ? (
        <Input
          placeholder="Enter starting text/input"
          value={chainInput}
          onChange={e => setChainInput(e.target.value)}
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
      ) : (
        <VStack align='stretch' gap={4}>
          {normalPrompt?.variables.map(v => (
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
      )}

      {!isChainMode && (
        <>
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
          <Button
            colorScheme="white"
            variant="ghost"
            _hover={{
              bg: 'whiteAlpha.300',
              transition: 'background 0.2s ease'
            }}
            mt={6}
            isLoading={loading}
            disabled={Object.values(vars).some(v => !v.trim())}
            onClick={runPrompt}
          >
            Run
          </Button>
        </>
      )}

      {isChainMode && (
        <Button
          colorScheme="white"
          variant="ghost"
          _hover={{
            bg: 'whiteAlpha.300',
            transition: 'background 0.2s ease'
          }}
          mt={6}
          isLoading={loading}
          disabled={!chainInput.trim()}
          onClick={runChain}
        >
          Run Chain
        </Button>
      )}

      {output && (
        <Box
          mt={5}
          p={4}
          bg="gray.800"
          color="white"
          borderRadius="md"
          fontFamily="mono"
          whiteSpace="pre-wrap"
          fontSize="sm"
        >
          {output}
        </Box>
      )}
    </Box>
  );
};
