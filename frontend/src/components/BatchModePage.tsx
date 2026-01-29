import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { PanelCard } from './PanelCard';
import { storageGetJson, storageSetJson } from '../storage';

type RunStage = 'Idle' | 'Queued' | 'Running' | 'Succeeded' | 'Failed';

type StoredRun = {
  id: string;
  kind: 'batch';
  label: string;
  startedAt: number;
  stage: RunStage;
  costUsd: number;
  logs: string[];
  output: string;
};

const RUNS_KEY = 'runs';
const MAX_RUNS = 12;

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function BatchModePage() {
  const toast = useToast();

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [limit, setLimit] = useState(10);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const [stage, setStage] = useState<RunStage>('Idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [costUsd, setCostUsd] = useState<number>(0);

  const [runs, setRuns] = useState<StoredRun[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);

  useEffect(() => {
    const stored = storageGetJson<StoredRun[]>(RUNS_KEY, []);
    setRuns(stored);
    setActiveRunId(stored[0]?.id ?? null);
  }, []);

  const activeRun = useMemo(
    () => runs.find((r) => r.id === activeRunId) || null,
    [runs, activeRunId],
  );

  const persistRuns = (next: StoredRun[]) => {
    const sliced = next.slice(0, MAX_RUNS);
    setRuns(sliced);
    storageSetJson(RUNS_KEY, sliced);
  };

  const runBatch = async () => {
    if (!csvFile) {
      toast({ title: 'Select a CSV file', status: 'error' });
      return;
    }
    if (!prompt.trim()) {
      toast({ title: 'Select a prompt', status: 'error' });
      return;
    }

    setLoading(true);
    setStage('Queued');
    setLogs([]);
    setCostUsd(0);

    const runId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const label = `Batch: ${prompt}`;
    const startedAt = Date.now();

    try {
      const form = new FormData();
      form.append('csv', csvFile);
      form.append('limit', limit.toString());
      form.append('prompt', prompt);

      const res = await fetch('http://localhost:8000/run-batch', {
        method: 'POST',
        body: form,
      });

      const json = await res.json();
      const out = json.stdout || json.stderr || 'No output';

      const nextRun: StoredRun = {
        id: runId,
        kind: 'batch',
        label,
        startedAt,
        stage: 'Succeeded',
        costUsd: 0,
        logs,
        output: out,
      };

      persistRuns([nextRun, ...runs]);
      setActiveRunId(nextRun.id);
    } catch {
      setStage('Failed');
      toast({ title: 'Run failed', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Grid
        templateColumns={{
          base: '1fr',
          lg: 'minmax(520px, 1fr) minmax(420px, 440px)',
        }}
        gap={6}
        alignItems="start"
      >
        <GridItem>
          <PanelCard>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                  CSV File
                </Text>
                <Button
                  as="label"
                  htmlFor="csv-upload"
                  w="full"
                  justifyContent="flex-start"
                  variant="outline"
                  bg="var(--surface)"
                  borderColor="var(--border)"
                  transition="background-color 140ms ease, box-shadow 140ms ease"
                  _hover={{ bg: 'var(--surfaceAlt)', borderColor: 'var(--border)' }}
                  _active={{ bg: 'var(--surfaceAlt)', borderColor: 'var(--border)' }}
                  _focusVisible={{ boxShadow: '0 0 0 2px var(--border)' }}
                >
                  {csvFile ? csvFile.name : 'Choose CSV file'}
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    display="none"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  />
                </Button>
                {!csvFile ? (
                  <Text mt={2} fontSize="sm" color="var(--textMuted)">
                    No CSV selected.
                  </Text>
                ) : null}
              </Box>

              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                    Batch Size
                  </Text>
                  <NumberInput
                    value={limit}
                    min={1}
                    w="full"
                    onChange={(_, valueAsNumber) => {
                      if (!isNaN(valueAsNumber)) setLimit(valueAsNumber);
                    }}
                  >
                    <NumberInputField
                      h="40px"
                      bg="var(--surface)"
                      borderColor="var(--border)"
                      color="var(--textPrimary)"
                      transition="background-color 140ms ease, box-shadow 140ms ease"
                      _hover={{ bg: 'var(--surfaceAlt)', borderColor: 'var(--border)' }}
                      _focusVisible={{ borderColor: 'var(--border)', boxShadow: '0 0 0 2px var(--border)', bg: 'var(--surface)' }}
                    />
                  </NumberInput>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="600" color="var(--textMuted)" mb={2}>
                    Prompt
                  </Text>
                  <Select
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    w="full"
                    bg="var(--surface)"
                    borderColor="var(--border)"
                    color="var(--textPrimary)"
                    h="40px"
                    transition="background-color 140ms ease, box-shadow 140ms ease"
                    _hover={{ bg: 'var(--surfaceAlt)', borderColor: 'var(--border)' }}
                    _focusVisible={{ borderColor: 'var(--border)', boxShadow: '0 0 0 2px var(--border)', bg: 'var(--surface)' }}
                  >
                    <option
                      value=""
                      style={{ background: 'var(--surface)', color: 'var(--textPrimary)' }}
                    >
                      Select...
                    </option>
                    <option
                      value="summarize"
                      style={{ background: 'var(--surface)', color: 'var(--textPrimary)' }}
                    >
                      summarize
                    </option>
                    <option
                      value="sql_gen"
                      style={{ background: 'var(--surface)', color: 'var(--textPrimary)' }}
                    >
                      sql_gen
                    </option>
                  </Select>
                </Box>
              </Grid>

              <HStack justify="space-between">
                <Text fontSize="sm" color="var(--textMuted)">
                  Status: {stage} - Cost: ${costUsd.toFixed(2)}
                </Text>
                <Button
                  variant="subtle"
                  onClick={runBatch}
                  isLoading={loading}
                >
                  Run
                </Button>
              </HStack>
            </VStack>
          </PanelCard>
        </GridItem>

        <GridItem>
          <PanelCard>
            <Text fontSize="sm" fontWeight="700" color="var(--textPrimary)" mb={3}>
              Recent Runs
            </Text>
            {runs.length === 0 ? (
              <Box>
                <Text color="var(--textMuted)" fontSize="sm">
                  No runs yet.
                </Text>
              </Box>
            ) : (
              <VStack align="stretch" spacing={2}>
                {runs.map((r) => {
                  const isActive = r.id === activeRunId;
                  return (
                    <Button
                      key={r.id}
                      variant="ghost"
                      justifyContent="space-between"
                      px={3}
                      py={2}
                      h="auto"
                      bg={isActive ? 'var(--surfaceAlt)' : 'transparent'}
                      border="1px solid"
                      borderColor={isActive ? 'var(--border)' : 'transparent'}
                      _hover={{ bg: 'var(--surfaceAlt)', borderColor: 'var(--border)' }}
                      onClick={() => setActiveRunId(r.id)}
                    >
                      <Box textAlign="left">
                        <Text fontSize="sm" fontWeight="600" color="var(--textPrimary)">
                          {r.label}
                        </Text>
                        <Text fontSize="xs" color="var(--textMuted)">
                          {formatTime(r.startedAt)} - {r.stage} - ${r.costUsd.toFixed(2)}
                        </Text>
                      </Box>
                      <Text fontSize="lg" color="var(--textMuted)">
                        &gt;
                      </Text>
                    </Button>
                  );
                })}
              </VStack>
            )}
          </PanelCard>
        </GridItem>
      </Grid>

      <PanelCard>
        <Text fontSize="sm" fontWeight="700" color="var(--textPrimary)" mb={3}>
          Output Preview / Results
        </Text>
        {!activeRun ? (
          <Box>
            <Text color="var(--textMuted)" fontSize="sm">
              Run a batch prompt to see logs and results here.
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" spacing={4}>
            {activeRun.logs?.length ? (
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
                <Text fontSize="xs" color="var(--textMuted)" mb={2}>
                  {activeRun.stage} - Cost: ${activeRun.costUsd.toFixed(2)}
                </Text>
                {activeRun.logs.join('\n')}
              </Box>
            ) : null}

            {activeRun.output ? (
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
                {activeRun.output}
              </Box>
            ) : (
              <Text color="var(--textMuted)" fontSize="sm">
                No output for this run.
              </Text>
            )}
          </VStack>
        )}
      </PanelCard>
    </VStack>
  );
}
