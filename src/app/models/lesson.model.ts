export interface Lesson {
  id: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Pessoal';
  englishText: string;
  portugueseText: string;
}

export type LevelFilter = 'Todos' | 'Iniciante' | 'Intermediário' | 'Avançado' | 'Pessoal';
