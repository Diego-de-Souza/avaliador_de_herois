import { PlayerClass, Enemy, ElementType } from '../core/interface/battle-heroes.interface';

export const CLASSES_JOGADOR: PlayerClass[] = [
  {
    id: 'guerreiro',
    nome: 'Guerreiro',
    descricao: 'Especialista em combate corpo a corpo com alta resistência',
    icone: '⚔️',
    statsBase: {
      vida: 120,
      vidaMax: 120,
      ataque: 25,
      defesa: 20,
      velocidade: 15,
      mana: 50,
      manaMax: 50,
      nivel: 1
    },
    recurso: 'furia',
    elemento: 'neutro',
    habilidades: [
      {
        id: 'golpe-poderoso',
        nome: 'Golpe Poderoso',
        descricao: 'Ataque devastador que causa 1.5x de dano',
        custo: 15,
        dano: 1.5,
        tipo: 'ataque',
        elemento: 'neutro'
      },
      {
        id: 'defesa-ferrea',
        nome: 'Defesa Férrea',
        descricao: 'Aumenta defesa em 50% por 3 turnos',
        custo: 20,
        dano: 0,
        tipo: 'buff',
        elemento: 'neutro',
        efeitos: [{
          id: 'def-buff',
          nome: 'Defesa Férrea',
          tipo: 'buff',
          duracao: 3,
          valor: 0.5,
          stat: 'defesa'
        }]
      },
      {
        id: 'furia-berserker',
        nome: 'Fúria Berserker',
        descricao: 'Ultimate: Dobra ataque por 5 turnos, mas reduz defesa',
        custo: 40,
        dano: 0,
        tipo: 'buff',
        elemento: 'neutro',
        isUltimate: true,
        efeitos: [
          {
            id: 'furia-atk',
            nome: 'Fúria',
            tipo: 'buff',
            duracao: 5,
            valor: 1.0,
            stat: 'ataque'
          },
          {
            id: 'furia-def',
            nome: 'Vulnerabilidade',
            tipo: 'debuff',
            duracao: 5,
            valor: -0.3,
            stat: 'defesa'
          }
        ]
      }
    ]
  },
  {
    id: 'mago',
    nome: 'Mago',
    descricao: 'Mestre das artes arcanas com magias devastadoras',
    icone: '🔮',
    statsBase: {
      vida: 80,
      vidaMax: 80,
      ataque: 30,
      defesa: 10,
      velocidade: 20,
      mana: 100,
      manaMax: 100,
      nivel: 1
    },
    recurso: 'mana',
    elemento: 'fogo',
    habilidades: [
      {
        id: 'bola-de-fogo',
        nome: 'Bola de Fogo',
        descricao: 'Projétil flamejante que causa dano elemental',
        custo: 25,
        dano: 1.3,
        tipo: 'ataque',
        elemento: 'fogo'
      },
      {
        id: 'escudo-arcano',
        nome: 'Escudo Arcano',
        descricao: 'Cria uma barreira mágica que absorve dano',
        custo: 30,
        dano: 0,
        tipo: 'defesa',
        elemento: 'neutro',
        efeitos: [{
          id: 'escudo',
          nome: 'Escudo Arcano',
          tipo: 'buff',
          duracao: 4,
          valor: 15,
          stat: 'vida'
        }]
      },
      {
        id: 'meteoro',
        nome: 'Meteoro',
        descricao: 'Ultimate: Chuva de meteoros causa dano massivo',
        custo: 60,
        dano: 2.5,
        tipo: 'ataque',
        elemento: 'fogo',
        isUltimate: true
      }
    ]
  },
  {
    id: 'arqueiro',
    nome: 'Arqueiro',
    descricao: 'Atirador preciso com alta velocidade e críticos',
    icone: '🏹',
    statsBase: {
      vida: 100,
      vidaMax: 100,
      ataque: 22,
      defesa: 15,
      velocidade: 25,
      mana: 70,
      manaMax: 70,
      nivel: 1
    },
    recurso: 'energia',
    elemento: 'natureza',
    habilidades: [
      {
        id: 'tiro-certeiro',
        nome: 'Tiro Certeiro',
        descricao: 'Disparo preciso com chance aumentada de crítico',
        custo: 20,
        dano: 1.2,
        tipo: 'ataque',
        elemento: 'neutro'
      },
      {
        id: 'chuva-de-flechas',
        nome: 'Chuva de Flechas',
        descricao: 'Múltiplos disparos causam dano moderado',
        custo: 35,
        dano: 1.8,
        tipo: 'ataque',
        elemento: 'natureza'
      },
      {
        id: 'flecha-perfurante',
        nome: 'Flecha Perfurante',
        descricao: 'Ultimate: Ignora defesa e causa dano verdadeiro',
        custo: 50,
        dano: 2.0,
        tipo: 'ataque',
        elemento: 'neutro',
        isUltimate: true
      }
    ]
  }
];

export const INIMIGOS: Enemy[] = [
  {
    id: 'cavaleiro-bronze',
    nome: 'Cavaleiro de Bronze',
    nivel: 1,
    vida: 100,
    vidaMax: 100,
    ataque: 20,
    defesa: 15,
    velocidade: 12,
    elemento: 'neutro',
    tipo: 'normal',
    sprite: '🛡️',
    descricao: 'Um cavaleiro novato buscando provar seu valor',
    habilidades: [
      {
        id: 'golpe-espada',
        nome: 'Golpe de Espada',
        descricao: 'Ataque básico com espada',
        custo: 0,
        dano: 1.0,
        tipo: 'ataque',
        elemento: 'neutro'
      }
    ],
    ia: {
      agressividade: 0.6,
      estrategia: 'agressivo',
      usaHabilidadeEm: 0.5,
      fugaEm: 0.1
    }
  },
  {
    id: 'feiticeira-chamas',
    nome: 'Feiticeira das Chamas',
    nivel: 3,
    vida: 120,
    vidaMax: 120,
    ataque: 28,
    defesa: 12,
    velocidade: 18,
    elemento: 'fogo',
    tipo: 'normal',
    sprite: '🔥',
    descricao: 'Maga especialista em magias de fogo devastadoras',
    habilidades: [
      {
        id: 'rajada-fogo',
        nome: 'Rajada de Fogo',
        descricao: 'Ataque em área com chamas',
        custo: 15,
        dano: 1.3,
        tipo: 'ataque',
        elemento: 'fogo'
      },
      {
        id: 'explosao-ardente',
        nome: 'Explosão Ardente',
        descricao: 'Grande explosão de fogo',
        custo: 25,
        dano: 1.8,
        tipo: 'ataque',
        elemento: 'fogo'
      }
    ],
    ia: {
      agressividade: 0.8,
      estrategia: 'agressivo',
      usaHabilidadeEm: 0.7,
      fugaEm: 0.2
    }
  },
  {
    id: 'dragao-obsidiana',
    nome: 'Dragão de Obsidiana',
    nivel: 5,
    vida: 300,
    vidaMax: 300,
    ataque: 40,
    defesa: 30,
    velocidade: 15,
    elemento: 'fogo',
    tipo: 'chefe',
    sprite: '🐲',
    descricao: 'CHEFE: Dragão ancestral com escamas de obsidiana',
    habilidades: [
      {
        id: 'baforada-fogo',
        nome: 'Baforada de Fogo',
        descricao: 'Jato devastador de chamas draconicas',
        custo: 20,
        dano: 2.0,
        tipo: 'ataque',
        elemento: 'fogo'
      },
      {
        id: 'rugido-terror',
        nome: 'Rugido do Terror',
        descricao: 'Reduz ataque e velocidade do inimigo',
        custo: 15,
        dano: 0,
        tipo: 'debuff',
        elemento: 'neutro',
        efeitos: [
          {
            id: 'terror-atk',
            nome: 'Terror',
            tipo: 'debuff',
            duracao: 3,
            valor: -0.3,
            stat: 'ataque'
          },
          {
            id: 'terror-vel',
            nome: 'Terror',
            tipo: 'debuff',
            duracao: 3,
            valor: -0.2,
            stat: 'velocidade'
          }
        ]
      }
    ],
    ia: {
      agressividade: 0.9,
      estrategia: 'adaptativo',
      usaHabilidadeEm: 0.8,
      fugaEm: 0.0
    }
  }
  // Adicionar mais inimigos conforme necessário...
];

export const VANTAGENS_ELEMENTAIS: Record<ElementType, ElementType[]> = {
  fogo: ['natureza'],
  agua: ['fogo'],
  natureza: ['agua'],
  neutro: []
};

export function calcularVantagemElemental(atacante: ElementType, defensor: ElementType): number {
  if (VANTAGENS_ELEMENTAIS[atacante].includes(defensor)) {
    return 1.5; // 50% mais dano
  }
  if (VANTAGENS_ELEMENTAIS[defensor].includes(atacante)) {
    return 0.75; // 25% menos dano
  }
  return 1.0; // Dano normal
}