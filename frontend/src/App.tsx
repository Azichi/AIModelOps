import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme } from './theme';
import { PromptProvider, usePromptCtx } from './PromptContext';
import { Sidebar } from './components/Sidebar';
import { PromptCards } from './components/PromptCards';
import { PromptForm } from './components/PromptForm';
import { BatchRunner } from './components/BatchRunner';

function AppInner() {
  const { selectedCategory } = usePromptCtx();

  return (
    <>
      <Sidebar />
      <Box ml='240px' mr='400px' p={8}>
        {selectedCategory?.id === '__batch_mode__' ? <BatchRunner /> : <PromptCards />}
      </Box>
      <PromptForm />
    </>
  );
}


export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <PromptProvider>
        <AppInner />
      </PromptProvider>
    </ChakraProvider>
  );
}
