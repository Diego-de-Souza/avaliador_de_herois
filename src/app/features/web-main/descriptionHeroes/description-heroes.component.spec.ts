import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DescriptionHeroesComponent } from './description-heroes.component';
import { HeroisService } from '../../../core/service/herois/herois.service';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { ImageService } from '../../../core/service/image/image.service';
import { of } from 'rxjs';

describe('DescriptionHeroesComponent', () => {
  let component: DescriptionHeroesComponent;
  let fixture: ComponentFixture<DescriptionHeroesComponent>;
  let heroService: jest.Mocked<HeroisService>;
  let themeService: jest.Mocked<ThemeService>;
  let imageService: jest.Mocked<ImageService>;

  beforeEach(async () => {
    const heroServiceMock = {
      getDataHero: jest.fn().mockReturnValue(of({ dataUnit: { name: 'Test Hero' } }))
    };

    const themeServiceMock = {
      theme$: of('dark')
    };

    const imageServiceMock = {
      getImageUrl: jest.fn().mockReturnValue('test-image-url')
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        DescriptionHeroesComponent
      ],
      providers: [
        { provide: HeroisService, useValue: heroServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: ImageService, useValue: imageServiceMock }
      ]
    })
    .compileComponents();

    // Mock history.state
    Object.defineProperty(window, 'history', {
      value: {
        state: { selectedCard: null }
      },
      writable: true
    });

    fixture = TestBed.createComponent(DescriptionHeroesComponent);
    component = fixture.componentInstance;
    heroService = TestBed.inject(HeroisService) as jest.Mocked<HeroisService>;
    themeService = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;
    imageService = TestBed.inject(ImageService) as jest.Mocked<ImageService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
