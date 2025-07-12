import { v4 as uuid } from 'uuid';
import { Category } from './types';

export const seed: Category[] = [
  {
    id: '__batch_mode__',
    name: 'Batch Mode',
    prompts: [
      {
        id: '__batch_card__',
        name: 'Batch Runner',
        description: 'Upload CSV and run LLM batch jobs.',
        template: '',
        variables: [],
      },
    ],
  },
  {
  id: '__chain_mode__',
  name: 'Chain Mode',
  prompts: [
    // ...chain prompt configs here, or leave empty for now...
  ],
},

  {
    id: uuid(),
    name: 'Marketing',
    prompts: [
      {
        id: uuid(),
        name: 'Twitter Thread',
        description: 'Long-form twitter thread.',
        template:
          'Write a {tone} twitter thread about {topic}. Thread should have {sections} sections.',
        variables: [
          { key: 'tone', placeholder: 'Witty' },
          { key: 'topic', placeholder: 'React Hooks' },
          { key: 'sections', placeholder: '5' },
        ],
      },
    ],
  },
  {
    id: uuid(),
    name: 'UX Copy',
    prompts: [],
  },
];
