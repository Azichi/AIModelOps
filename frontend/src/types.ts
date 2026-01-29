export type Variable = {
  key: string;
  placeholder: string;
};

export type Prompt = {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: Variable[];
};

export type Chain = {
  id: string;
  name: string;
  description: string;
  chainFile: string;
};

export type Category = {
  id: string;
  name: string;
  prompts: Prompt[];
};

export type ChainCategory = {
  id: string;
  name: string;
  prompts: Chain[];
};

export type AnyCategory = Category | ChainCategory;

