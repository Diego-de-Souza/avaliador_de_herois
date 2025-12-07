import { GameSection, ClassInfo, ElementalInfo } from '../core/interface/explanation_game_heroes_battle.interface';

export const GAME_SECTIONS: GameSection[] = [
  {
    id: 'overview',
    title: 'Visão Geral',
    icon: '🎯',
    content: [
      'Hero Battle é um RPG de turnos onde você enfrenta heróis poderosos em batalhas táticas.',
      'Progrida através de 13 níveis desafiadores, incluindo 3 chefes épicos.',
      'Desenvolva seu personagem, desbloqueie habilidades e domine as artes do combate.'
    ]
  },
  {
    id: 'getting-started',
    title: 'Como Começar',
    icon: '🚀',
    content: [
      'Ao iniciar o jogo, você deve escolher uma das 3 classes disponíveis.',
      'Cada classe possui estatísticas únicas, habilidades especiais e estilos de jogo diferentes.',
      'Sua escolha determinará sua estratégia de combate e progressão.'
    ],
    subsections: [
      {
        title: 'Escolhendo sua Classe',
        content: [
          'Analise cuidadosamente as estatísticas base de cada classe',
          'Considere seu estilo de jogo preferido (agressivo, defensivo, mágico)',
          'Lembre-se que cada classe tem vantagens em diferentes situações'
        ],
        tips: [
          'Guerreiros são ideais para iniciantes por sua alta resistência',
          'Magos causam muito dano, mas requerem gestão cuidadosa de mana',
          'Arqueiros são versáteis com boa velocidade e críticos'
        ]
      }
    ]
  },
  {
    id: 'combat-system',
    title: 'Sistema de Combate',
    icon: '⚔️',
    content: [
      'O combate é baseado em turnos, onde a velocidade determina quem age primeiro.',
      'Em cada turno, você pode escolher entre atacar, usar habilidades ou itens.',
      'Gerencie seus recursos (vida, mana/energia) estrategicamente.'
    ],
    subsections: [
      {
        title: 'Ordem dos Turnos',
        content: [
          'A velocidade determina quem age primeiro',
          'Personagens mais rápidos podem agir múltiplas vezes',
          'Algumas habilidades podem alterar a ordem dos turnos'
        ]
      },
      {
        title: 'Tipos de Ações',
        content: [
          '🗡️ ATACAR: Ataque básico sem custo de recursos',
          '✨ HABILIDADES: Ataques especiais que consomem mana/energia',
          '🛡️ DEFENDER: Reduz dano recebido no próximo turno',
          '🧪 ITENS: Use poções e consumíveis (quando disponíveis)'
        ]
      },
      {
        title: 'Cálculo de Dano',
        content: [
          'Dano = (Ataque do atacante - Defesa do defensor) × Modificadores',
          'Críticos causam 50% mais dano (chance baseada na velocidade)',
          'Vantagem elemental pode aumentar ou reduzir o dano',
          'Alguns ataques ignoram defesa completamente'
        ]
      }
    ]
  },
  {
    id: 'character-progression',
    title: 'Progressão do Personagem',
    icon: '📈',
    content: [
      'Ganhe experiência derrotando inimigos para subir de nível.',
      'Cada nível aumenta seus atributos e pode desbloquear novas habilidades.',
      'Habilidades Ultimate são desbloqueadas no nível 5.'
    ],
    subsections: [
      {
        title: 'Ganho de Experiência',
        content: [
          'EXP ganha = Nível do inimigo × 20 pontos',
          'Chefes concedem experiência bônus',
          'Ao subir de nível, você é totalmente curado'
        ]
      },
      {
        title: 'Crescimento de Atributos por Nível',
        content: [
          '❤️ Vida Máxima: +10 pontos',
          '⚔️ Ataque: +3 pontos',
          '🛡️ Defesa: +2 pontos',
          '🔮 Mana Máxima: +10 pontos',
          '⚡ Velocidade: Cresce gradualmente'
        ]
      }
    ]
  },
  {
    id: 'abilities-system',
    title: 'Sistema de Habilidades',
    icon: '🔮',
    content: [
      'Cada classe possui habilidades únicas que consomem recursos específicos.',
      'Habilidades podem causar dano, aplicar efeitos ou modificar estatísticas.',
      'Gerencie seus recursos cuidadosamente para maximizar sua efetividade.'
    ],
    subsections: [
      {
        title: 'Tipos de Habilidades',
        content: [
          '⚔️ ATAQUE: Causam dano direto ao inimigo',
          '🛡️ DEFESA: Aumentam resistência ou criam escudos',
          '💊 CURA: Restauram vida ou removem efeitos negativos',
          '📈 BUFF: Melhoram temporariamente seus atributos',
          '📉 DEBUFF: Enfraquecem o inimigo temporariamente'
        ]
      },
      {
        title: 'Recursos por Classe',
        content: [
          '🗡️ GUERREIRO - Fúria: Gerada ao receber e causar dano',
          '🔮 MAGO - Mana: Regenera lentamente a cada turno',
          '🏹 ARQUEIRO - Energia: Regenera rapidamente, mas em menor quantidade'
        ]
      },
      {
        title: 'Habilidades Ultimate',
        content: [
          'Desbloqueadas no nível 5',
          'Custam mais recursos mas são extremamente poderosas',
          'Podem virar o rumo de batalhas difíceis',
          'Use estrategicamente contra chefes'
        ]
      }
    ]
  },
  {
    id: 'elemental-system',
    title: 'Sistema Elemental',
    icon: '🌟',
    content: [
      'Elementos criam vantagens e desvantagens táticas no combate.',
      'Explorar fraquezas elementais pode ser decisivo em batalhas difíceis.',
      'Cada classe e inimigo possui um elemento associado.'
    ],
    subsections: [
      {
        title: 'Vantagens Elementais',
        content: [
          '🔥 Fogo vence 🌿 Natureza (+50% dano)',
          '💧 Água vence 🔥 Fogo (+50% dano)',
          '🌿 Natureza vence 💧 Água (+50% dano)',
          '⚪ Neutro não tem vantagens nem desvantagens'
        ]
      }
    ]
  },
  {
    id: 'enemies-bosses',
    title: 'Inimigos e Chefes',
    icon: '👹',
    content: [
      'Cada nível apresenta um inimigo único com habilidades e estratégias próprias.',
      'Chefes aparecem nos níveis 5, 10 e 13 com poderes especiais.',
      'A IA dos inimigos se adapta conforme a situação da batalha.'
    ],
    subsections: [
      {
        title: 'Tipos de Inimigos',
        content: [
          '🛡️ Cavaleiros: Equilibrados, bons para iniciantes',
          '🔥 Magos: Alto dano mágico, baixa resistência física',
          '🏹 Arqueiros: Ataques à distância com críticos altos',
          '🐲 Dragões: Chefes com múltiplas habilidades devastadoras'
        ]
      },
      {
        title: 'Comportamento da IA',
        content: [
          'Inimigos adaptam estratégia baseada na vida atual',
          'Chefes mudam de fase ao atingir certos limiares de vida',
          'IA exploram fraquezas elementais do jogador',
          'Alguns inimigos priorizam cura quando feridos'
        ]
      }
    ]
  },
  {
    id: 'strategies-tips',
    title: 'Estratégias e Dicas',
    icon: '💡',
    content: [
      'Domine estas estratégias para se tornar um verdadeiro campeão!',
      'Adaptabilidade e planejamento são chaves para a vitória.',
      'Cada situação exige uma abordagem diferente.'
    ],
    subsections: [
      {
        title: 'Estratégias Gerais',
        content: [
          'Sempre observe a barra de vida do inimigo para antecipar mudanças de comportamento',
          'Gerencie seus recursos pensando na batalha toda, não apenas no turno atual',
          'Use vantagens elementais sempre que possível',
          'Guarde habilidades Ultimate para momentos críticos'
        ],
        tips: [
          'Contra chefes, foque primeiro em sobrevivência, depois em dano',
          'Habilidades de buff são mais eficazes no início da batalha',
          'Observe os padrões de ataque dos inimigos para se preparar'
        ]
      },
      {
        title: 'Dicas por Classe',
        content: [
          '🗡️ GUERREIRO: Use "Defesa Férrea" antes de receber ataques pesados',
          '🔮 MAGO: Alterne entre ataques e regeneração de mana',
          '🏹 ARQUEIRO: Aproveite sua velocidade para múltiplos ataques'
        ]
      },
      {
        title: 'Táticas Avançadas',
        content: [
          'Combine habilidades de debuff antes de usar ataques poderosos',
          'Use o terreno e elementos a seu favor',
          'Estude os padrões dos chefes para explorar janelas de oportunidade',
          'Timing é crucial - saiba quando ser agressivo e quando ser defensivo'
        ]
      }
    ]
  }
];

export const CLASSES_INFO: ClassInfo[] = [
  {
    id: 'guerreiro',
    name: 'Guerreiro',
    icon: '🗡️',
    description: 'Especialista em combate corpo a corpo com excelente resistência',
    strengths: [
      'Alta vida e defesa natural',
      'Habilidades que aumentam resistência',
      'Fúria aumenta com o combate',
      'Ideal para batalhas prolongadas'
    ],
    weaknesses: [
      'Menor dano mágico',
      'Velocidade moderada',
      'Dependente de combate próximo'
    ],
    bestFor: 'Jogadores iniciantes e estratégias defensivas'
  },
  {
    id: 'mago',
    name: 'Mago',
    icon: '🔮',
    description: 'Mestre das artes arcanas com magias devastadoras',
    strengths: [
      'Maior dano mágico do jogo',
      'Vantagem elemental de fogo',
      'Habilidades de área e controle',
      'Escudo mágico para proteção'
    ],
    weaknesses: [
      'Baixa vida e defesa física',
      'Dependente de mana',
      'Vulnerável a ataques rápidos'
    ],
    bestFor: 'Jogadores que preferem estratégias ofensivas'
  },
  {
    id: 'arqueiro',
    name: 'Arqueiro',
    icon: '🏹',
    description: 'Atirador preciso com alta mobilidade e críticos devastadores',
    strengths: [
      'Maior velocidade do jogo',
      'Alta chance de crítico',
      'Ataques que ignoram defesa',
      'Versatilidade tática'
    ],
    weaknesses: [
      'Vida moderada',
      'Recursos limitados',
      'Requer precisão tática'
    ],
    bestFor: 'Jogadores experientes que gostam de risco/recompensa'
  }
];

export const ELEMENTAL_INFO: ElementalInfo[] = [
  {
    element: 'Fogo',
    icon: '🔥',
    strongAgainst: 'Natureza',
    weakAgainst: 'Água',
    description: 'Elemento ofensivo que causa dano contínuo'
  },
  {
    element: 'Água',
    icon: '💧',
    strongAgainst: 'Fogo',
    weakAgainst: 'Natureza',
    description: 'Elemento defensivo com habilidades de cura'
  },
  {
    element: 'Natureza',
    icon: '🌿',
    strongAgainst: 'Água',
    weakAgainst: 'Fogo',
    description: 'Elemento equilibrado com regeneração'
  },
  {
    element: 'Neutro',
    icon: '⚪',
    strongAgainst: 'Nenhum',
    weakAgainst: 'Nenhum',
    description: 'Sem vantagens ou desvantagens elementais'
  }
];