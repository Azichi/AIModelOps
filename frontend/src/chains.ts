import { Chain } from './types';

export const chains: Chain[] = [
  {
    id: 'chain_extract_analyze_report',
    name: 'Extract + Analyze + Report',
    description: 'Extracts data, analyzes it, and writes a report.',
    chainFile: 'prompt_chains/extract_analyze_report.yaml',
  },
];
