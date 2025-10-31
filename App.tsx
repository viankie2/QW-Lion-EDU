import React, { useState, useCallback, useMemo } from 'react';
import { IeltsScores, ToeflScores, University } from './types';
import { getUniversityRecommendations } from './services/geminiService';
import ScoreInput from './components/ScoreInput';
import UniversityCard from './components/UniversityCard';
import { UniversityIcon } from './components/Icons';
import SortControls, { SortKey, SortDirection } from './components/SortControls';

const App: React.FC = () => {
  const [testType, setTestType] = useState<'IELTS' | 'TOEFL'>('IELTS');
  const [ieltsScores, setIeltsScores] = useState<IeltsScores>({ overall: '7.5', reading: '7.0', writing: '7.0', listening: '7.0', speaking: '7.0' });
  const [toeflScores, setToeflScores] = useState<ToeflScores>({ overall: '100', reading: '25', writing: '25', listening: '25', speaking: '25' });
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'qsRanking', direction: 'ascending' });

  const handleSubmit = useCallback(async () => {
    setHasSearched(true);
    setIsLoading(true);
    setError(null);
    setUniversities([]);

    try {
      const scores = testType === 'IELTS' ? ieltsScores : toeflScores;
      const results = await getUniversityRecommendations(testType, scores);
      setUniversities(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [testType, ieltsScores, toeflScores]);
  
  const handleSort = useCallback((key: SortKey) => {
    setSortConfig(currentConfig => {
      const direction: SortDirection =
        currentConfig.key === key && currentConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending';
      return { key, direction };
    });
  }, []);

  const sortedUniversities = useMemo(() => {
    if (universities.length === 0) return [];
    
    const probabilityOrder: { [key: string]: number } = { 'High': 1, 'Medium': 2, 'Low': 3 };
    
    const sorted = [...universities].sort((a, b) => {
      const { key, direction } = sortConfig;
      const dir = direction === 'ascending' ? 1 : -1;

      switch (key) {
        case 'qsRanking':
          return (a.qsRanking - b.qsRanking) * dir;
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'successProbability':
          const valA = probabilityOrder[a.successProbability] ?? 4;
          const valB = probabilityOrder[b.successProbability] ?? 4;
          return (valA - valB) * dir;
        default:
          return 0;
      }
    });

    return sorted;
  }, [universities, sortConfig]);


  const scores = testType === 'IELTS' ? ieltsScores : toeflScores;
  const isButtonDisabled = Object.values(scores).some(score => score.trim() === '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <UniversityIcon className="h-10 w-10 text-indigo-500" />
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">University Admissions Advisor</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter your English test scores to get personalized QS Top 200 university recommendations.
          </p>
        </header>

        <main>
          <div className="mb-6">
            <ScoreInput
              testType={testType}
              setTestType={setTestType}
              ieltsScores={ieltsScores}
              setIeltsScores={setIeltsScores}
              toeflScores={toeflScores}
              setToeflScores={setToeflScores}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading || isButtonDisabled}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Consulting Advisor...' : 'Find Universities'}
            </button>
          </div>

          <div className="mt-10">
            {isLoading && (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse [animation-delay:0.4s]"></div>
                <p className="text-gray-600 dark:text-gray-400">Finding the best matches for you...</p>
              </div>
            )}
            {error && <div className="text-center p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg">{error}</div>}
            
            {!isLoading && !error && hasSearched && universities.length > 0 && (
              <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-center mb-4">Your Recommended Universities</h2>
                  <SortControls sortConfig={sortConfig} onSort={handleSort} />
                  {sortedUniversities.map((uni) => (
                      <UniversityCard key={uni.name} university={uni} />
                  ))}
              </div>
            )}

            {!isLoading && !error && hasSearched && universities.length === 0 && (
               <div className="text-center text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
                 <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Matches Found</h3>
                 <p className="mt-2">We couldn't find any universities in the QS Top 200 that match your scores. You might want to double-check your entries or consider retaking the exam.</p>
               </div>
            )}

            {!isLoading && !error && !hasSearched && (
               <div className="text-center text-gray-500 dark:text-gray-400 pt-8">
                 <p>Your results will appear here after you submit your scores.</p>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
