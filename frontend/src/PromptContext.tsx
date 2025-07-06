import { createContext, useContext, useState } from 'react';
import { Category, Prompt } from './types';
import { seed } from './data';
import { v4 as uuid } from 'uuid';

type Ctx = {
categories: Category[];
selectCategory: (id: string) => void;
selectedCategory?: Category;
selectPrompt: (id: string) => void;
selectedPrompt?: Prompt;
addCategory: (name: string) => void;
editCategory: (id: string, name: string) => void;
deleteCategory: (id: string) => void;
addPrompt: (cId: string, p: Omit<Prompt, 'id'>) => void;
editPrompt: (cId: string, p: Prompt) => void;
deletePrompt: (cId: string, pId: string) => void;
};

const PromptCtx = createContext({} as Ctx);
export const usePromptCtx = () => useContext(PromptCtx);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [categories, setCats] = useState<Category[]>(seed);
const [selectedCategoryId, setCatId] = useState<string | undefined>(seed[0]?.id);
const [selectedPromptId, setPromptId] = useState<string | undefined>();

const selectedCategory = categories.find(c => c.id === selectedCategoryId);
const selectedPrompt =
selectedCategory?.prompts.find(p => p.id === selectedPromptId);

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
setPromptId(undefined);
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

return (
<PromptCtx.Provider
value={{
categories,
selectCategory: setCatId,
selectedCategory,
selectPrompt: setPromptId,
selectedPrompt,
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