export enum Genre {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non-binary',
  ALIEN = 'alien',
  ROBOT = 'robot',
  OTHER = 'other'
}

export const GENRE_LABELS: Record<Genre, string> = {
  [Genre.MALE]: 'Masculino',
  [Genre.FEMALE]: 'Feminino',
  [Genre.NON_BINARY]: 'Não-binário',
  [Genre.ALIEN]: 'Alienígena',
  [Genre.ROBOT]: 'Robô/IA',
  [Genre.OTHER]: 'Outro'
};

export const GENRE_OPTIONS = Object.entries(GENRE_LABELS).map(([value, label]) => ({
  value: value as Genre,
  label
}));