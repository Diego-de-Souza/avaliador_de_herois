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
            const userFromDB = {
              name: response.dataUnit.name,
              morality: response.dataUnit.morality,
              studio: response.dataUnit.studio,
              power_type: response.dataUnit.power_type,
              release_date: response.dataUnit.release_date,
              first_appearance: response.dataUnit.first_appearance,
              creator: response.dataUnit.creator,
              weak_point: response.dataUnit.weak_point,
              imagem: response.dataUnit.image1,
              imagem_cover: response.dataUnit.image2,
              team: response.dataUnit.team,
              affiliation: response.dataUnit.affiliation,
              history: response.dataUnit.story,
              genre: response.dataUnit.genre
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
