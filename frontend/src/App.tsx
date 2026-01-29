import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { PromptProvider } from './PromptContext';
import { AppShell } from './components/AppShell';
import { createLocalStorageManager } from '@chakra-ui/react';
import './App.css';


export default function App() {
  return (
    <ChakraProvider
      theme={theme}
      resetCSS={false}
      colorModeManager={createLocalStorageManager('aiModelOps_chakra-ui-color-mode')}
    >
      <PromptProvider>
        <AppShell />
      </PromptProvider>
    </ChakraProvider>
  );
}
