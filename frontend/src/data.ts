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
    prompts: [],
  },

  {
    id: uuid(),
    name: 'Marketing',
    prompts: [
      {
        id: uuid(),
        name: 'Product Update Brief',
        description: 'Draft a concise product update for stakeholders.',
        template:
          'Write a {tone} product update about {topic}. Include {sections} short sections.',
        variables: [
          { key: 'tone', placeholder: 'Concise' },
          { key: 'topic', placeholder: 'Q2 roadmap' },
          { key: 'sections', placeholder: '4' },
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
