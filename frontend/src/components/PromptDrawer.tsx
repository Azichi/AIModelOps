import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { usePromptCtx } from '../PromptContext';
import { Chain, Prompt } from '../types';

type RunStage = 'Idle' | 'Queued' | 'Running' | 'Succeeded' | 'Failed';

function isChain(p: unknown): p is Chain {
  return typeof p === 'object' && !!p && 'chainFile' in (p as any);
}

function isPrompt(p: unknown): p is Prompt {
  return typeof p === 'object' && !!p && 'template' in (p as any) && 'variables' in (p as any);
}

export function PromptDrawer() {
  const { selectedPrompt, selectedCategory, clearPrompt } = usePromptCtx();
  const toast = useToast();

  const [vars, setVars] = useState<Record<string, string>>({});
  const [chainInput, setChainInput] = useState('');
  const [output, setOutput] = useState('');
  const [stage, setStage] = useState<RunStage>('Idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [costUsd, setCostUsd] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const prompt = isPrompt(selectedPrompt) ? selectedPrompt : null;
  const chain = isChain(selectedPrompt) ? selectedPrompt : null;
  const isChainMode = selectedCategory?.id === '__chain_mode__';

  useEffect(() => {
    setVars({});
    setChainInput('');
    setOutput('');
    setStage('Idle');
    setLogs([]);
    setCostUsd(0);
    setLoading(false);
  }, [selectedPrompt?.id]);

  const filled = useMemo(() => {
    if (!prompt) return '';
    return prompt.template.replace(/{(\w+)}/g, (_, k) => vars[k] ?? '');
  }, [prompt, vars]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(filled);
      toast({ title: 'Prompt copied', status: 'success', duration: 1500 });
    } catch {
      toast({ title: 'Copy failed', status: 'error', duration: 1500 });
    }
  };

  const runSingle = async () => {
    if (!prompt) return;
    setLoading(true);
    setOutput('');
    setStage('Queued');
    setLogs([]);
    setCostUsd(0);
    try {
      const res = await fetch('http://localhost:8000/run-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: prompt.id, variables: vars }),
      });
      const data = await res.json();
      setOutput(data.output || '');
      setStage('Succeeded');
    } catch {
      setOutput('Error');
      setStage('Failed');
    } finally {
      setLoading(false);
    }
  };

  const runChain = async () => {
    if (!chain) return;
    setLoading(true);
    setOutput('');
    setStage('Queued');
    setLogs([]);
    setCostUsd(0);
    try {
      const res = await fetch('http://localhost:8000/run-chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chain_file: chain.chainFile,
          message: chainInput,
          model: 'gpt-4o',
        }),
      });
      const data = await res.json();
      setOutput(data.output || '');
      setStage('Succeeded');
    } catch {
      setOutput('Error');
      setStage('Failed');
    } finally {
      setLoading(false);
    }
  };

  const canRunSingle =
    !!prompt && prompt.variables.every((v) => (vars[v.key] ?? '').trim().length > 0);

  return (
    <Drawer isOpen={!!selectedPrompt} placement="right" onClose={clearPrompt} size="sm">
      <DrawerOverlay bg="rgba(0,0,0,0.55)" />
      <DrawerContent
        maxW="420px"
        w="100%"
        bg="var(--surface)"
        color="var(--textPrimary)"
        borderLeft="1px solid var(--border)"
      >
        <DrawerCloseButton mt={2} />
        <DrawerHeader borderBottom="1px solid var(--border)">
          <Text fontSize="md" fontWeight="800">
            {selectedPrompt?.name || 'Details'}
          </Text>
          <Text mt={1} fontSize="sm" color="var(--textMuted)" fontWeight="500">
            {isChainMode ? 'Chain runner' : 'Prompt runner'}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          <VStack align="stretch" spacing={4} pt={4}>
            {chain ? (
              <Box>
                <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                  Input
                </Text>
                <Textarea
                  value={chainInput}
                  onChange={(e) => setChainInput(e.target.value)}
                  placeholder="Enter starting text/input"
                  sx={{ '::placeholder': { color: 'var(--textMuted)', opacity: 0.6 } }}
                  minH="120px"
                  w="full"
                />
              </Box>
            ) : null}

            {prompt ? (
              <VStack align="stretch" spacing={3}>
                <Text fontSize="sm" fontWeight="700" color="var(--textPrimary)">
                  Variables
                </Text>
                {prompt.variables.length === 0 ? (
                  <Text fontSize="sm" color="var(--textMuted)">
                    No variables for this prompt.
                  </Text>
                ) : (
                  prompt.variables.map((v) => (
                    <Box key={v.key}>
                      <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                        {v.key}
                      </Text>
                      <Input
                        value={vars[v.key] ?? ''}
                        onChange={(e) => setVars({ ...vars, [v.key]: e.target.value })}
                        placeholder={v.placeholder || v.key}
                        sx={{ '::placeholder': { color: 'var(--textMuted)', opacity: 0.6 } }}
                        w="full"
                      />
                    </Box>
                  ))
                )}

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                    Filled Preview
                  </Text>
                  <Box
                    bg="var(--surfaceAlt)"
                    border="1px solid var(--border)"
                    borderRadius="10px"
                    p={4}
                    fontFamily="mono"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                  >
                    {filled || 'n/a'}
                  </Box>
                </Box>
              </VStack>
            ) : null}

            {(logs.length > 0 || stage !== 'Idle') && (
              <Box
                bg="var(--surfaceAlt)"
                border="1px solid var(--border)"
                borderRadius="10px"
                p={4}
                fontFamily="mono"
                fontSize="sm"
                whiteSpace="pre-wrap"
              >
                <Text mb={2} fontSize="xs" color="var(--textMuted)" fontFamily="inherit">
                  Status: {stage} - Cost: ${costUsd.toFixed(2)}
                </Text>
                {logs.join('\n')}
              </Box>
            )}

            {output ? (
              <Box
                bg="var(--surfaceAlt)"
                border="1px solid var(--border)"
                borderRadius="10px"
                p={4}
                fontFamily="mono"
                fontSize="sm"
                whiteSpace="pre-wrap"
              >
                {output}
              </Box>
            ) : null}
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTop="1px solid var(--border)">
          <HStack w="full" justify="flex-end" spacing={2}>
              {prompt ? (
                <Button
                  variant="subtle"
                  onClick={copy}
                  isDisabled={!filled}
                >
                  Copy
                </Button>
              ) : null}

              {prompt ? (
                <Button
                  variant="subtle"
                  onClick={runSingle}
                  isLoading={loading}
                  isDisabled={!canRunSingle}
                >
                  Run
                </Button>
              ) : null}

              {chain ? (
                <Button
                  variant="subtle"
                  onClick={runChain}
                  isLoading={loading}
                  isDisabled={!chainInput.trim()}
                >
                  Run Chain
                </Button>
              ) : null}
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
