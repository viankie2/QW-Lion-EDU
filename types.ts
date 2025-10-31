
export interface University {
  name: string;
  nameCN: string;
  country: string;
  qsRanking: number;
  minIELTS: number | string;
  minTOEFL: number | string;
  successProbability: 'High' | 'Medium' | 'Low' | string;
  reasoning: string;
  website: string;
  recommendedMajors: string[];
}

export interface IeltsScores {
  overall: string;
  reading: string;
  writing: string;
  listening: string;
  speaking: string;
}

export interface ToeflScores {
  overall: string;
  reading: string;
  writing: string;
  listening: string;
  speaking: string;
}