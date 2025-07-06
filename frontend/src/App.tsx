import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme } from './theme';
import { PromptProvider } from './PromptContext';
import { Sidebar } from './components/Sidebar';
import { PromptCards } from './components/PromptCards';
import { PromptForm } from './components/PromptForm';

export default function App() {
return (
<ChakraProvider theme={theme}>
<PromptProvider>
<Sidebar />
<Box ml='240px' mr='400px' p={8}>
<PromptCards />
</Box>
<PromptForm />
</PromptProvider>
</ChakraProvider>
);
}