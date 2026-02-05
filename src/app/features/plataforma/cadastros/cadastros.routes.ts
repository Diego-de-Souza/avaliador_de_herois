import { Routes } from "@angular/router";



export const routesCadastros: Routes = [
    {
        path: 'artigos',
        title: 'Cadastro de Artigos',
        loadComponent: () => import('./cadastro-artigos/cadastro-artigos.component').then(m => m.CadastroArtigosComponent)
    },
    {
        path: 'artigos/:id',
        title: 'Atualizacao de Artigos',
        loadComponent: () => import('./cadastro-artigos/cadastro-artigos.component').then(m => m.CadastroArtigosComponent)
    },
    {
        path: 'newsletter',
        title: 'Cadastro de Newsletter',
        loadComponent: () => import('./cadastro-newsletter/cadastro-newsletter.component').then(m => m.CadastroNewsletterComponent)
    },
    {
        path: 'newsletter/:id',
        title: 'Edição de Newsletter',
        loadComponent: () => import('./cadastro-newsletter/cadastro-newsletter.component').then(m => m.CadastroNewsletterComponent)
    },
    {
        path: 'heroi',
        title: 'Cadastro de Herói',
        loadComponent: () => import('./cadastro-dados/cadastro-dados.component').then(m => m.CadastroDadosComponent)
    },
    {
        path: 'heroi/:id',
        title: 'Atualizacao de Herói',
        loadComponent: () => import('./cadastro-dados/cadastro-dados.component').then(m => m.CadastroDadosComponent)
    },
    {
        path: 'studio',
        title: 'Cadastro de Studio',
        loadComponent: () => import('./cadastro-studio/cadastro-studio.component').then(m => m.CadastroStudioComponent)
    },
    {
        path: 'studio/:id',
        title: 'Atualizacao de Studio',
        loadComponent: () => import('./cadastro-studio/cadastro-studio.component').then(m => m.CadastroStudioComponent)
    },
    {
        path: 'team',
        title: 'Cadastro de Team',
        loadComponent: () => import('./cadastro-team/cadastro-team.component').then(m => m.CadastroTeamComponent)
    },
    {
        path: 'team/:id',
        title: 'Atualizacao de Team',
        loadComponent: () => import('./cadastro-team/cadastro-team.component').then(m => m.CadastroTeamComponent)
    },
    {
        path: 'quiz-cadastro',
        title: 'Cadastro de Quiz',
        loadComponent: () => import('./cadastro-quiz/cadastro-quiz.component').then(m => m.CadastroQuizComponent)
    },
    {
        path: 'quiz-cadastro/:id/:level_id',
        title: 'Atualizacao de Quiz',
        loadComponent: () => import('./cadastro-quiz/cadastro-quiz.component').then(m => m.CadastroQuizComponent)
    },
    {
        path: 'question-cadastro',
        title: 'Cadastro de Perguntas',
        loadComponent: () => import('./cadastro-quiz/questions/questions.component').then(m => m.QuestionsComponent)
    },
    {
        path: 'question-cadastro/:quiz_level_id',
        title: 'Atualizacao de Perguntas',
        loadComponent: () => import('./cadastro-quiz/questions/questions.component').then(m => m.QuestionsComponent)
    },
    {
        path: 'events-cadastro',
        title: 'Cadastro de Eventos',
        loadComponent: () => import('./cadastro-eventos/cadastro-eventos.component').then(m => m.CadastroEventosComponent)
    },
    {
        path: 'games-cadastro',
        title: 'Cadastro de Games',
        loadComponent: () => import('./cadastro-games/cadastro-games').then(m => m.Games)
    },
    {
        path: 'games-cadastro/:id',
        title: 'Atualizacao de Games',
        loadComponent: () => import('./cadastro-games/cadastro-games').then(m => m.Games)
    }
]
