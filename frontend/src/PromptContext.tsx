import { createContext, useContext, useState } from 'react';
import { seed } from './data';
import { v4 as uuid } from 'uuid';
import { Category, Prompt, Chain, AnyCategory } from './types';




const CHAIN_MODE_ID = '__chain_mode__';

type Ctx = {
categories: Category[];
selectCategory: (id: string) => void;
selectedCategory?: AnyCategory;
selectPrompt: (p: Prompt | Chain) => void;
selectedPrompt?: Prompt | Chain;
clearPrompt: () => void;
addCategory: (name: string) => void;
editCategory: (id: string, name: string) => void;
deleteCategory: (id: string) => void;
addPrompt: (cId: string, p: Omit<Prompt, 'id'>) => void;
editPrompt: (cId: string, p: Prompt) => void;
deletePrompt: (cId: string, pId: string) => void;
};


const PromptCtx = createContext({} as Ctx);
export const usePromptCtx = () => useContext(PromptCtx);



export const chains = [
  {
    id: 'chain_extract_analyze_report',
    name: 'Extract + Analyze + Report',
    description: 'Extracts data, analyzes it, and writes a report.',
    chainFile: 'prompt_chains/extract_analyze_report.yaml',
  },
];


export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [categories, setCats] = useState<Category[]>(seed);
const [selectedCategoryId, setCatId] = useState<string | undefined>(seed[0]?.id);
const [selectedPrompt, setPrompt] = useState<Prompt | Chain | undefined>();


const selectedCategory: AnyCategory | undefined =
  selectedCategoryId === CHAIN_MODE_ID
    ? { id: CHAIN_MODE_ID, name: 'Chain Mode', prompts: chains }
    : categories.find(c => c.id === selectedCategoryId);



const mutateCats = (fn: (c: Category[]) => Category[]) => setCats(fn);

const addCategory = (name: string) =>
mutateCats(c => [...c, { id: uuid(), name, prompts: [] }]);

const editCategory = (id: string, name: string) =>
mutateCats(c =>
c.map(cat => (cat.id === id ? { ...cat, name } : cat)),
);

const deleteCategory = (id: string) => {
mutateCats(c => c.filter(cat => cat.id !== id));
if (selectedCategoryId === id) {
setCatId(undefined);
setPrompt(undefined);
}
};

const addPrompt = (cId: string, p: Omit<Prompt, 'id'>) =>
mutateCats(c =>
c.map(cat =>
cat.id === cId ? { ...cat, prompts: [...cat.prompts, { ...p, id: uuid() }] } : cat,
),
);

const editPrompt = (cId: string, p: Prompt) =>
mutateCats(c =>
c.map(cat =>
cat.id === cId
? { ...cat, prompts: cat.prompts.map(pr => (pr.id === p.id ? p : pr)) }
: cat,
),
);

const deletePrompt = (cId: string, pId: string) =>
mutateCats(c =>
c.map(cat =>
cat.id === cId ? { ...cat, prompts: cat.prompts.filter(pr => pr.id !== pId) } : cat,
),
);

const selectCategory = (id: string) => {
  setCatId(id);
  setPrompt(undefined);
};

const clearPrompt = () => setPrompt(undefined);




return (
<PromptCtx.Provider
value={{
categories,
selectCategory,
selectedCategory,
selectPrompt: setPrompt,
selectedPrompt,
clearPrompt,
addCategory,
editCategory,
deleteCategory,
addPrompt,
editPrompt,
deletePrompt,
}}
>
{children}
</PromptCtx.Provider>
);
};
