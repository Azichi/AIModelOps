import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
    },
  },
  fonts: { body: 'SF Pro Text, sans-serif' },
  components: {
    _leftIcon: { baseStyle: { borderRadius: 'lg' } },
    Modal: { baseStyle: { dialog: { bg: 'var(--surface)' } } },
    CloseButton: {
      baseStyle: {
        color: 'var(--textPrimary)',
        borderRadius: '10px',
        _hover: { bg: 'var(--surfaceAlt)' },
        _active: { bg: 'var(--surfaceAlt)' },
        _focusVisible: {
          boxShadow: '0 0 0 2px var(--border)',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: '10px',
        fontWeight: 700,
        _focusVisible: {
          boxShadow: '0 0 0 2px var(--border)',
        },
      },
      variants: {
        primary: {
          bg: 'var(--accent)',
          color: 'white',
          _hover: { bg: 'var(--accentHover)' },
          _active: { bg: 'var(--accentHover)' },
        },
        subtle: {
          bg: 'var(--surfaceAlt)',
          color: 'var(--textPrimary)',
          border: '1px solid var(--border)',
          _hover: { bg: 'var(--surface)', borderColor: 'var(--border)' },
          _active: { bg: 'var(--surface)', borderColor: 'var(--border)' },
        },
        outline: {
          bg: 'transparent',
          color: 'var(--textPrimary)',
          border: '1px solid var(--border)',
          _hover: { borderColor: 'var(--border)', bg: 'var(--surface)' },
          _active: { borderColor: 'var(--border)', bg: 'var(--surface)' },
        },
        ghost: {
          bg: 'transparent',
          color: 'var(--textPrimary)',
          _hover: { bg: 'var(--surfaceAlt)' },
          _active: { bg: 'var(--surfaceAlt)' },
        },
        danger: {
          bg: 'var(--danger)',
          color: 'white',
          _hover: { filter: 'brightness(0.95)' },
          _active: { filter: 'brightness(0.92)' },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--textPrimary)',
          borderRadius: '10px',
          h: '40px',
          px: 3,
          _hover: { borderColor: 'var(--border)', bg: 'var(--surface)' },
          _focusVisible: { borderColor: 'var(--border)', boxShadow: 'none' },
          _placeholder: { color: 'var(--textMuted)', opacity: 0.7 },
        },
      },
    },
    Textarea: {
      baseStyle: {
        bg: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--textPrimary)',
        borderRadius: '10px',
        px: 3,
        py: 2,
        _hover: { borderColor: 'var(--border)', bg: 'var(--surface)' },
        _focusVisible: { borderColor: 'var(--border)', boxShadow: 'none' },
        _placeholder: { color: 'var(--textMuted)', opacity: 0.7 },
      },
    },
    Select: {
      baseStyle: {
        field: {
          bg: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--textPrimary)',
          borderRadius: '10px',
          h: '40px',
          px: 3,
          _hover: { borderColor: 'var(--border)', bg: 'var(--surface)' },
          _focusVisible: { borderColor: 'var(--border)', boxShadow: 'none' },
        },
        icon: {
          color: 'var(--textMuted)',
        },
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          bg: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--textPrimary)',
          borderRadius: '10px',
          h: '40px',
          px: 3,
          _hover: { borderColor: 'var(--border)', bg: 'var(--surface)' },
          _focusVisible: { borderColor: 'var(--border)', boxShadow: 'none' },
        },
      },
    },
  },
});
