export interface PlayerStats {
  vida: number;
  vidaMax: number;
  ataque: number;
  defesa: number;
  velocidade: number;
  mana: number;
  manaMax: number;
  nivel: number;
  experiencia: number;
  experienciaProximo: number;
}

export interface PlayerClass {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  statsBase: Omit<PlayerStats, 'experiencia' | 'experienciaProximo'>;
  recurso: 'mana' | 'energia' | 'furia';
  elemento: ElementType;
  habilidades: Habilidade[];
}

export interface Enemy {
  id: string;
  nome: string;
  nivel: number;
  vida: number;
  vidaMax: number;
  ataque: number;
  defesa: number;
  velocidade: number;
  elemento: ElementType;
  tipo: 'normal' | 'chefe';
  habilidades: Habilidade[];
  ia: IABehavior;
  sprite: string;
  descricao: string;
}

export interface Habilidade {
  id: string;
  nome: string;
  descricao: string;
  custo: number;
  dano: number;
  tipo: 'ataque' | 'defesa' | 'cura' | 'buff' | 'debuff';
  elemento: ElementType;
  efeitos?: StatusEffect[];
  cooldown?: number;
  isUltimate?: boolean;
}

export interface StatusEffect {
  id: string;
  nome: string;
  tipo: 'buff' | 'debuff';
  duracao: number;
  valor: number;
  stat: keyof PlayerStats;
}

export type ElementType = 'fogo' | 'agua' | 'natureza' | 'neutro';

export interface IABehavior {
  agressividade: number; // 0-1
  estrategia: 'agressivo' | 'defensivo' | 'adaptativo';
  usaHabilidadeEm: number; // % de vida para usar habilidades especiais
  fugaEm: number; // % de vida para tentar fugir (se aplicável)
}

export interface GameState {
  jogador: {
    classe: PlayerClass;
    stats: PlayerStats;
    equipamentos: Equipment[];
    inventario: Item[];
    statusEffects: StatusEffect[];
  };
  inimigo: Enemy | null;
  nivel: number;
  turno: 'jogador' | 'inimigo';
  fase: 'selecao-classe' | 'batalha' | 'vitoria' | 'derrota' | 'level-up';
  log: string[];
}

export interface Equipment {
  id: string;
  nome: string;
  tipo: 'arma' | 'armadura' | 'acessorio';
  bonus: Partial<PlayerStats>;
  raridade: 'comum' | 'raro' | 'epico' | 'lendario';
}

export interface Item {
  id: string;
  nome: string;
  tipo: 'pocao' | 'consumivel';
  efeito: StatusEffect | Partial<PlayerStats>;
  quantidade: number;
}