export type Variable = { key: string; placeholder: string };
export type Prompt   = {
id: string;
name: string;
description: string;
template: string;      // “Write a {tone} tweet about {topic}”
variables: Variable[];
};
export type Category = {
id: string;
name: string;
prompts: Prompt[];
};