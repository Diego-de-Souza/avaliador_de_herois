import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerVideos } from './banner-videos';

describe('BannerVideos', () => {
  let component: BannerVideos;
  let fixture: ComponentFixture<BannerVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerVideos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerVideos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
