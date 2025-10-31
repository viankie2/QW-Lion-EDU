
import React from 'react';
import { IeltsScores, ToeflScores } from '../types';

interface ScoreInputProps {
  testType: 'IELTS' | 'TOEFL';
  setTestType: (type: 'IELTS' | 'TOEFL') => void;
  ieltsScores: IeltsScores;
  setIeltsScores: (scores: IeltsScores) => void;
  toeflScores: ToeflScores;
  setToeflScores: (scores: ToeflScores) => void;
}

const ScoreInput: React.FC<ScoreInputProps> = ({
  testType,
  setTestType,
  ieltsScores,
  setIeltsScores,
  toeflScores,
  setToeflScores,
}) => {
  const handleIeltsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIeltsScores({ ...ieltsScores, [e.target.name]: e.target.value });
  };

  const handleToeflChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToeflScores({ ...toeflScores, [e.target.name]: e.target.value });
  };

  const renderIeltsInputs = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <InputField label="Overall" name="overall" value={ieltsScores.overall} onChange={handleIeltsChange} placeholder="e.g., 7.5" max={9} />
      <InputField label="Reading" name="reading" value={ieltsScores.reading} onChange={handleIeltsChange} placeholder="e.g., 8.0" max={9}/>
      <InputField label="Writing" name="writing" value={ieltsScores.writing} onChange={handleIeltsChange} placeholder="e.g., 7.0" max={9}/>
      <InputField label="Listening" name="listening" value={ieltsScores.listening} onChange={handleIeltsChange} placeholder="e.g., 7.5" max={9}/>
      <InputField label="Speaking" name="speaking" value={ieltsScores.speaking} onChange={handleIeltsChange} placeholder="e.g., 7.0" max={9}/>
    </div>
  );

  const renderToeflInputs = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <InputField label="Overall" name="overall" value={toeflScores.overall} onChange={handleToeflChange} placeholder="e.g., 100" max={120}/>
      <InputField label="Reading" name="reading" value={toeflScores.reading} onChange={handleToeflChange} placeholder="e.g., 25" max={30}/>
      <InputField label="Writing" name="writing" value={toeflScores.writing} onChange={handleToeflChange} placeholder="e.g., 25" max={30}/>
      <InputField label="Listening" name="listening" value={toeflScores.listening} onChange={handleToeflChange} placeholder="e.g., 25" max={30}/>
      <InputField label="Speaking" name="speaking" value={toeflScores.speaking} onChange={handleToeflChange} placeholder="e.g., 25" max={30}/>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <TabButton isActive={testType === 'IELTS'} onClick={() => setTestType('IELTS')}>IELTS</TabButton>
        <TabButton isActive={testType === 'TOEFL'} onClick={() => setTestType('TOEFL')}>TOEFL</TabButton>
      </div>
      <div>
        {testType === 'IELTS' ? renderIeltsInputs() : renderToeflInputs()}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => {
  const activeClasses = "border-indigo-500 text-indigo-600 dark:text-indigo-400";
  const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600";
  return (
    <button
      onClick={onClick}
      className={`-mb-px py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    max: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, placeholder, max }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min="0"
            max={max}
            step={name.includes('overall') && max === 9 ? '0.5' : '1'}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
        />
    </div>
);


export default ScoreInput;
