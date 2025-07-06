import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
styles: {
global: {
body: {
bg: '#0f0f0f',
color: 'gray.100',
},
},
},
fonts: { body: 'SF Pro Text, sans-serif' },
components: {
_leftIcon: { baseStyle: { borderRadius: 'lg' } },
Modal:  { baseStyle: { dialog: { bg: '#1a1a1a' } } },
},
});