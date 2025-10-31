import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './Icons';

export type SortKey = 'qsRanking' | 'name' | 'successProbability';
export type SortDirection = 'ascending' | 'descending';

interface SortControlsProps {
  sortConfig: { key: SortKey; direction: SortDirection };
  onSort: (key: SortKey) => void;
}

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'qsRanking', label: 'QS Rank' },
  { key: 'name', label: 'Name' },
  { key: 'successProbability', label: 'Probability' },
];

const SortControls: React.FC<SortControlsProps> = ({ sortConfig, onSort }) => {
  return (
    <div className="flex justify-center items-center flex-wrap gap-2 mb-6">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Sort by:</span>
      {sortOptions.map(({ key, label }) => {
        const isActive = sortConfig.key === key;
        return (
          <button
            key={key}
            onClick={() => onSort(key)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              isActive
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {label}
            {isActive && (
              sortConfig.direction === 'ascending' 
              ? <ArrowUpIcon className="h-4 w-4" /> 
              : <ArrowDownIcon className="h-4 w-4" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SortControls;
