import { DataEvents } from "../core/interface/data-events.interface";

export const bannerInit: DataEvents[] = [
    {
			url: '/img/home/a7.jpg',
            type: 'image',
			title: 'Busque seus heróis favoritos',
			description: 'Conheça mais sobre os heróis.',
			rota: '/webmain/busca_heroes',
			date: 'SEARCH OF HEROES',
			menuDesc: 'The Fantastic Four: First Steps'
		},
		{
			url: '/img/home/a2.jpg',
            type: 'image',
			title: 'Artigos inteiros sobre heróis',
			description: 'Detalhes impressionantes e marcantes.',
			rota: '/webmain/artigos',
			date: 'ARTICLES',
			menuDesc: 'Eyes Of Wakanda'
		},
		{
			url: '/img/home/a3.png',
            type: 'image',
			title: 'Curiosidades do mundo Geek',
			description: 'Se quer saber mais é só vim ver!',
			rota: '/webmain/conteudo/newsletter',
			date: 'NEWSLETTER',
			menuDesc: 'The Official Marvel Podcast'
		},
		{
			url: '/img/home/a5.jpg',
            type: 'image',
			title   : 'Games',
			description: 'Mostre sua força em nossos jogos.',
			rota: '/webmain/games',
			date: 'GAMES',
			menuDesc: 'How To Read Fantastic Four'
		}
]