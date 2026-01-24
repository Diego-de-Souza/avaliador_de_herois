# Hero Platform Game - Integração Angular 19

Este jogo foi refatorado para funcionar com Angular 19. O código está estruturado em uma classe `HeroGame` que pode ser facilmente integrada em um componente Angular.

## Estrutura do Projeto

- `script.js` - Classe principal `HeroGame` com toda a lógica do jogo
- `index.html` - HTML de exemplo (pode ser removido ao integrar no Angular)
- `style.css` - Estilos do jogo

## Como Integrar no Angular 19

### 1. Instalar Phaser

```bash
npm install phaser
```

### 2. Criar um Componente Angular

```typescript
// hero-game.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HeroGame } from './hero-game.service';

@Component({
  selector: 'app-hero-game',
  template: `
    <div id="gameContainer"></div>
    <div id="menu">
      <h1>HERO PLATFORM</h1>
      <p>
        You're a superhero racing against time!<br>
        Collect energy orbs to maintain your power.<br>
        Avoid villains that drain your energy.<br>
        <strong>Save the city!</strong>
      </p>
      <button id="startBtn">START MISSION</button>
      <button id="howToPlayBtn">HOW TO PLAY</button>
      <button id="highScoresBtn">HIGH SCORES</button>
    </div>
    <div id="ui" class="hidden">
      <div>Score: <span id="scoreValue">0</span></div>
      <div>Level: <span id="levelValue">1</span></div>
      <div>Lives: <span id="livesValue">3</span></div>
    </div>
    <div id="energyMeter" class="hidden">
      <div class="label">Hero Energy</div>
      <div class="bar-container">
        <div class="bar" id="energyBar" style="width: 100%"></div>
      </div>
    </div>
    <div id="instructions" class="hidden">
      Arrow Keys or WASD to Move • Up or Space to Jump • Collect Energy Orbs to Stay Powered!
    </div>
  `,
  styleUrls: ['./hero-game.component.css']
})
export class HeroGameComponent implements OnInit, OnDestroy {
  private gameInstance: HeroGame | null = null;

  ngOnInit() {
    // Aguardar o DOM estar pronto
    setTimeout(() => {
      this.gameInstance = new HeroGame('gameContainer');
      this.gameInstance.init();
      this.setupEventListeners();
    }, 0);
  }

  ngOnDestroy() {
    if (this.gameInstance) {
      this.gameInstance.destroy();
    }
  }

  private setupEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    const highScoresBtn = document.getElementById('highScoresBtn');

    startBtn?.addEventListener('click', () => {
      this.gameInstance?.startGame();
    });

    howToPlayBtn?.addEventListener('click', () => {
      this.gameInstance?.showHowToPlay();
    });

    highScoresBtn?.addEventListener('click', () => {
      this.gameInstance?.showHighScores();
    });
  }
}
```

### 3. Criar um Serviço (Opcional)

```typescript
// hero-game.service.ts
import { Injectable } from '@angular/core';

// Copiar a classe HeroGame do script.js aqui
// ou importar de um arquivo separado

@Injectable({
  providedIn: 'root'
})
export class HeroGameService {
  // Métodos auxiliares se necessário
}
```

### 4. Adicionar Estilos

Copiar o conteúdo de `style.css` para `hero-game.component.css` ou importar globalmente.

### 5. Configurar Phaser no Angular

No seu `angular.json`, adicione o script do Phaser:

```json
{
  "scripts": [
    "node_modules/phaser/dist/phaser.min.js"
  ]
}
```

Ou importe diretamente no componente:

```typescript
import * as Phaser from 'phaser';
```

### 6. Usar o Componente

```html
<!-- app.component.html -->
<app-hero-game></app-hero-game>
```

## Mudanças Principais

### Tema de Heróis
- **Player**: Herói azul com capa vermelha e símbolo no peito
- **Coletáveis**: 
  - Energy Orbs (azul/ciano) - Restaura 15% de energia
  - Power Boosts (dourado) - Restaura 25% de energia
- **Perigos**:
  - Villains (vermelho) - Drena 20% de energia
  - Dark Energy (roxo) - Drena 15% de energia
- **Portal**: Portal azul/ciano com efeito heroico

### Mecânicas Adaptadas
- `freshness` → `heroEnergy` (energia do herói)
- `rotSpeed` → `energyDecay` (decaimento de energia)
- Visual do herói muda de cor conforme a energia diminui
- Temas e textos adaptados para narrativa de super-heróis

### Estrutura Modular
- Classe `HeroGame` encapsula toda a lógica
- Métodos públicos para controle do jogo
- Compatível com injeção de dependência do Angular
- Fácil de testar e manter

## Funcionalidades

- ✅ 5 níveis progressivos
- ✅ Sistema de vidas (3 vidas)
- ✅ Sistema de pontuação e high scores
- ✅ Coletáveis e perigos
- ✅ Portal de conclusão de nível
- ✅ Interface adaptada para tema de heróis
- ✅ Compatível com Angular 19

## Próximos Passos

1. Integrar o componente no seu projeto Angular
2. Ajustar estilos conforme necessário
3. Adicionar mais níveis ou features conforme desejar
4. Implementar serviços Angular para gerenciar estado se necessário

## Notas

- O jogo usa `localStorage` para salvar high scores
- Todos os gráficos são gerados programaticamente (sem assets externos)
- O código está preparado para ser facilmente integrado em um componente Angular
