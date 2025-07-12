import {
  VStack, Input, NumberInput, NumberInputField, Select,
  Button, useToast, Box, Text
} from '@chakra-ui/react';
import { useState } from 'react';

export function BatchRunner() {
  const [csvFile, setCSV] = useState<File | null>(null);
  const [limit, setLimit] = useState(10);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const toast = useToast();

  const runBatch = async () => {
    if (!csvFile || !prompt) {
      toast({ title: "Select CSV and prompt", status: "error" });
      return;
    }

    const form = new FormData();
    form.append("csv", csvFile);
    form.append("limit", limit.toString());
    form.append("prompt", prompt);

    const res = await fetch("http://localhost:8000/run-batch", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    setResponse(json.stdout || json.stderr || "No output");
  };

  return (
    <Box p={6} bg="#1a1a1a" borderRadius="lg">
      <VStack spacing={5} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Run Batch Prompt</Text>

    <Box>
      <Text mb={1}>CSV File</Text>
      <Button
        as="label"
        htmlFor="csv-upload"
        colorScheme="white"
        variant="outline"
        _hover={{ bg: "green.600", borderColor: "green.500" }}
        textAlign="left"
        justifyContent="flex-start"
      >
        {csvFile ? csvFile.name : 'Choose CSV File'}
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          display="none"
          onChange={e => setCSV(e.target.files?.[0] || null)}
        />
      </Button>
    </Box>


        <Box>
          <Text mb={1}>Batch Size
          </Text>
          <NumberInput
            defaultValue={10}
            
            onChange={(_, valueAsNumber) => {
              if (!isNaN(valueAsNumber)) setLimit(valueAsNumber);
            }
          }
          >
            <NumberInputField
            color="white"
            _hover={{ borderColor: "green.500" }}
            _focus={{ borderColor: "green.500", boxShadow: "none" }}
            />
          </NumberInput>

        </Box>

        <Box>
          <Text mb={1}>Select Prompt</Text>
          <Select
            onChange={e => setPrompt(e.target.value)}
            color="white"
            _hover={{ borderColor: "green.500" }}
            _focus={{ borderColor: "green.500", boxShadow: "none" }}
          >
            <option value="summarize" style={{ background: "#1a1a1a", color: "white" }}>
              summarize
            </option>
            <option value="sql_gen" style={{ background: "#1a1a1a", color: "white" }}>
              sql_gen
            </option>
          </Select>

        </Box>

        <Button colorScheme="green" onClick={runBatch}>
          Run
        </Button>

        {response && (
          <Box
            whiteSpace="pre-wrap"
            bg="gray.800"
            p={4}
            borderRadius="md"
            color="white"
            fontSize="sm"
            mt={4}
          >
            {response}
          </Box>
        )}
      </VStack>
    </Box>
  );

}
