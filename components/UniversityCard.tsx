
import React from 'react';
import { University } from '../types';
import { UniversityIcon, CheckCircleIcon, ChartBarIcon, GlobeIcon, LinkIcon, AcademicCapIcon } from './Icons';

interface UniversityCardProps {
  university: University;
}

const getProbabilityClass = (probability: string) => {
  switch (probability.toLowerCase()) {
    case 'high':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'low':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <UniversityIcon className="h-6 w-6 text-indigo-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{university.name}</h3>
            </div>
            {university.nameCN && (
              <p className="ml-9 -mt-1 mb-2 text-md text-gray-500 dark:text-gray-400">{university.nameCN}</p>
            )}
            <div className="ml-9 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <GlobeIcon className="h-4 w-4 mr-1.5" />
              <span>{university.country}</span>
              <span className="mx-2">|</span>
              <ChartBarIcon className="h-4 w-4 mr-1.5" />
              <span>QS Rank: {university.qsRanking}</span>
            </div>
          </div>
          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getProbabilityClass(university.successProbability)}`}>
            {university.successProbability}
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Admissions Info</h4>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">IELTS:</span> {Number(university.minIELTS) > 0 ? university.minIELTS : 'N/A'}
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">TOEFL:</span> {Number(university.minTOEFL) > 0 ? university.minTOEFL : 'N/A'}
                </div>
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    <LinkIcon className="h-4 w-4 mr-1.5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {university.recommendedMajors && university.recommendedMajors.length > 0 && (
                <div>
                    <div className="flex items-center mb-2">
                        <AcademicCapIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Recommended Majors</h4>
                    </div>
                    <ul className="space-y-1.5 ml-1">
                        {university.recommendedMajors.map((major) => (
                            <li key={major} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                <span className="text-indigo-500 mr-2 mt-1">&#8227;</span>
                                <span>{major}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div>
               <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-500 mr-2.5 mt-0.5 flex-shrink-0"/>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{university.reasoning}</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;