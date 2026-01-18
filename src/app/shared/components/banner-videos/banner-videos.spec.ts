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
    // Initialize with mock data to prevent template errors
    component.dataEvents = [
      {
        id: 1,
        title: 'Test Event',
        type: 'image',
        url: 'https://example.com/image.jpg',
        description: 'Test description'
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
