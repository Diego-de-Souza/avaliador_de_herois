import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudioComponent } from './view-studio.component';

describe('ViewStudioComponent', () => {
  let component: ViewStudioComponent;
  let fixture: ComponentFixture<ViewStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
