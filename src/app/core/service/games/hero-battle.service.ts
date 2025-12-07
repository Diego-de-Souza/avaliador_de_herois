import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState, PlayerClass, Enemy, Habilidade, StatusEffect } from '../../interface/battle-heroes.interface';
import { CLASSES_JOGADOR, INIMIGOS, calcularVantagemElemental } from '../../../data/battle-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroBattleService {
  private gameStateSubject = new BehaviorSubject<GameState>({
    jogador: {
      classe: CLASSES_JOGADOR[0],
      stats: { ...CLASSES_JOGADOR[0].statsBase, experiencia: 0, experienciaProximo: 100 },
      equipamentos: [],
      inventario: [],
      statusEffects: []
    },
    inimigo: null,
    nivel: 1,
    turno: 'jogador',
    fase: 'selecao-classe',
    log: []
  });

  gameState$ = this.gameStateSubject.asObservable();

  get currentGameState(): GameState {
    return this.gameStateSubject.value;
  }

  selecionarClasse(classeId: string): void {
    const classe = CLASSES_JOGADOR.find(c => c.id === classeId);
    if (!classe) return;

    const state = this.currentGameState;
    state.jogador.classe = classe;
    state.jogador.stats = { 
      ...classe.statsBase, 
      experiencia: 0, 
      experienciaProximo: 100 
    };
    state.fase = 'batalha';
    
    this.iniciarNivel(1);
    this.gameStateSubject.next(state);
  }

  iniciarNivel(nivel: number): void {
    const state = this.currentGameState;
    const inimigo = this.obterInimigoPorNivel(nivel);
    
    state.nivel = nivel;
    state.inimigo = { ...inimigo };
    state.turno = state.jogador.stats.velocidade >= inimigo.velocidade ? 'jogador' : 'inimigo';
    state.fase = 'batalha';
    state.log = [`Nível ${nivel}: Enfrentando ${inimigo.nome}!`];
    
    this.gameStateSubject.next(state);
  }

  private obterInimigoPorNivel(nivel: number): Enemy {
    const inimigo = INIMIGOS.find(i => i.nivel === nivel) || INIMIGOS[0];
    return { ...inimigo };
  }

  usarHabilidade(habilidade: Habilidade): void {
    const state = this.currentGameState;
    if (state.turno !== 'jogador' || !state.inimigo) return;

    // Verificar recursos
    const custoRecurso = habilidade.custo;
    if (state.jogador.stats.mana < custoRecurso) {
      state.log.push('Recursos insuficientes!');
      this.gameStateSubject.next(state);
      return;
    }

    // Consumir recurso
    state.jogador.stats.mana -= custoRecurso;

    // Executar habilidade
    this.executarHabilidade(habilidade, 'jogador');
  }

  atacar(): void {
    const state = this.currentGameState;
    if (state.turno !== 'jogador' || !state.inimigo) return;

    const dano = this.calcularDano(
      state.jogador.stats.ataque,
      state.inimigo.defesa,
      state.jogador.classe.elemento,
      state.inimigo.elemento
    );

    state.inimigo.vida = Math.max(0, state.inimigo.vida - dano);
    state.log.push(`Você causou ${dano} de dano em ${state.inimigo.nome}!`);

    this.verificarFimDeBatalha();
    if (state.fase === 'batalha') {
      this.proximoTurno();
    }
  }

  private executarHabilidade(habilidade: Habilidade, executor: 'jogador' | 'inimigo'): void {
    const state = this.currentGameState;
    
    if (habilidade.tipo === 'ataque') {
      const atacante = executor === 'jogador' ? state.jogador.stats : state.inimigo!;
      const defensor = executor === 'jogador' ? state.inimigo! : state.jogador.stats;
      const elementoAtacante = executor === 'jogador' ? state.jogador.classe.elemento : state.inimigo!.elemento;
      const elementoDefensor = executor === 'jogador' ? state.inimigo!.elemento : state.jogador.classe.elemento;

      const danoBase = atacante.ataque * habilidade.dano;
      const dano = this.calcularDano(danoBase, defensor.defesa, elementoAtacante, elementoDefensor);

      if (executor === 'jogador') {
        state.inimigo!.vida = Math.max(0, state.inimigo!.vida - dano);
        state.log.push(`${habilidade.nome} causou ${dano} de dano em ${state.inimigo!.nome}!`);
      } else {
        state.jogador.stats.vida = Math.max(0, state.jogador.stats.vida - dano);
        state.log.push(`${state.inimigo!.nome} usou ${habilidade.nome} e causou ${dano} de dano em você!`);
      }
    }

    // Aplicar efeitos de status
    if (habilidade.efeitos) {
      const alvo = executor === 'jogador' ? 
        (habilidade.tipo === 'buff' ? state.jogador : state.inimigo) :
        (habilidade.tipo === 'buff' ? state.inimigo : state.jogador);
      
      // Aplicar efeitos...
    }

    this.verificarFimDeBatalha();
    if (state.fase === 'batalha') {
      this.proximoTurno();
    }
  }

  private calcularDano(ataque: number, defesa: number, elementoAtacante: any, elementoDefensor: any): number {
    const danoBase = Math.max(1, ataque - defesa);
    const multiplicadorElemental = calcularVantagemElemental(elementoAtacante, elementoDefensor);
    
    // Chance de crítico (20%)
    const isCritico = Math.random() < 0.2;
    const multiplicadorCritico = isCritico ? 1.5 : 1.0;

    const danoFinal = Math.floor(danoBase * multiplicadorElemental * multiplicadorCritico);
    
    return danoFinal;
  }

  private verificarFimDeBatalha(): void {
    const state = this.currentGameState;
    
    if (state.jogador.stats.vida <= 0) {
      state.fase = 'derrota';
      state.log.push('Você foi derrotado!');
    } else if (state.inimigo && state.inimigo.vida <= 0) {
      state.fase = 'vitoria';
      state.log.push(`${state.inimigo.nome} foi derrotado!`);
      this.concederExperiencia();
    }
    
    this.gameStateSubject.next(state);
  }

  private concederExperiencia(): void {
    const state = this.currentGameState;
    const expGanha = state.nivel * 20;
    
    state.jogador.stats.experiencia += expGanha;
    state.log.push(`Você ganhou ${expGanha} pontos de experiência!`);
    
    // Verificar level up
    if (state.jogador.stats.experiencia >= state.jogador.stats.experienciaProximo) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    const state = this.currentGameState;
    state.jogador.stats.nivel++;
    state.jogador.stats.experiencia -= state.jogador.stats.experienciaProximo;
    state.jogador.stats.experienciaProximo = state.jogador.stats.nivel * 100;
    
    // Aumentar stats
    state.jogador.stats.vidaMax += 10;
    state.jogador.stats.vida = state.jogador.stats.vidaMax; // Curar ao subir de nível
    state.jogador.stats.ataque += 3;
    state.jogador.stats.defesa += 2;
    state.jogador.stats.manaMax += 10;
    state.jogador.stats.mana = state.jogador.stats.manaMax;
    
    state.fase = 'level-up';
    state.log.push(`Level Up! Agora você é nível ${state.jogador.stats.nivel}!`);
  }

  proximoNivel(): void {
    this.iniciarNivel(this.currentGameState.nivel + 1);
  }

  private proximoTurno(): void {
    const state = this.currentGameState;
    state.turno = state.turno === 'jogador' ? 'inimigo' : 'jogador';
    
    if (state.turno === 'inimigo') {
      setTimeout(() => this.turnoInimigo(), 1000);
    }
    
    this.gameStateSubject.next(state);
  }

  private turnoInimigo(): void {
    const state = this.currentGameState;
    if (!state.inimigo || state.turno !== 'inimigo') return;

    // IA simples
    const usarHabilidade = Math.random() < 0.4 && state.inimigo.habilidades.length > 1;
    
    if (usarHabilidade) {
      const habilidade = state.inimigo.habilidades[Math.floor(Math.random() * state.inimigo.habilidades.length)];
      this.executarHabilidade(habilidade, 'inimigo');
    } else {
      // Ataque básico
      const dano = this.calcularDano(
        state.inimigo.ataque,
        state.jogador.stats.defesa,
        state.inimigo.elemento,
        state.jogador.classe.elemento
      );

      state.jogador.stats.vida = Math.max(0, state.jogador.stats.vida - dano);
      state.log.push(`${state.inimigo.nome} atacou e causou ${dano} de dano!`);
      
      this.verificarFimDeBatalha();
      if (state.fase === 'batalha') {
        this.proximoTurno();
      }
    }
  }

  reiniciarJogo(): void {
    const state: GameState = {
      jogador: {
        classe: CLASSES_JOGADOR[0],
        stats: { ...CLASSES_JOGADOR[0].statsBase, experiencia: 0, experienciaProximo: 100 },
        equipamentos: [],
        inventario: [],
        statusEffects: []
      },
      inimigo: null,
      nivel: 1,
      turno: 'jogador',
      fase: 'selecao-classe',
      log: []
    };
    
    this.gameStateSubject.next(state);
  }
}