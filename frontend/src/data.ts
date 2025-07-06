import { v4 as uuid } from 'uuid';
import { Category } from './types';

export const seed: Category[] = [
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