import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroisService } from '../../../core/service/herois/herois.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ImageService } from '../../../core/service/image/image.service';
import { FlashLoadingComponent } from '../../../shared/components/flash-loading/flash-loading.component';
import { NgClass } from '@angular/common';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-description-heroes',
  standalone: true,
  imports: [HeaderComponent, FlashLoadingComponent, NgClass],
  templateUrl: './description-heroes.component.html',
  styleUrls: ['./description-heroes.component.css'],
})
export class DescriptionHeroesComponent implements OnInit {
  private imageService = inject(ImageService);
  private themeService = inject(ThemeService);

  public selectedCard: any;
  public heroId: any;
  public testeHero: any = null;
  private destroy$ = new Subject<void>();
  _currentTheme = 'dark';
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private heroService: HeroisService) {}

  ngOnInit() {
    this.isLoading = true;
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this._currentTheme = theme;
      });

    this.selectedCard = history.state.selectedCard;
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.heroId = Number(idParam);
        this.isLoading = true;
        this.heroService.getDataHero(this.heroId).subscribe(
          (response) => {
            const data = response.dataUnit || response;
            const userFromDB = {
              name: data.name,
              morality: data.morality,
              studio: data.studio?.name || data.studio || (data.studio_id ? `Studio ID: ${data.studio_id}` : 'N/A'),
              power_type: data.power_type,
              release_date: data.release_date,
              first_appearance: data.first_appearance,
              creator: data.creator,
              weak_point: data.weak_point,
              imagem: data.image1,
              imagem_cover: data.image2,
              team: data.team?.name || data.team || data.affiliation || (data.team_id ? `Team ID: ${data.team_id}` : 'N/A'),
              affiliation: data.affiliation,
              history: data.story,
              genre: data.genre
            };

            userFromDB.imagem = this.imageService.processImageField(userFromDB.imagem, 'image/jpeg');
            userFromDB.imagem_cover = this.imageService.processImageField(userFromDB.imagem_cover, 'image/png');

            this.testeHero = userFromDB;
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
      }
    });
  }
}
