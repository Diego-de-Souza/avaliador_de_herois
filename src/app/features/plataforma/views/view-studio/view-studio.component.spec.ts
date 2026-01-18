import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewStudioComponent } from './view-studio.component';

describe('ViewStudioComponent', () => {
  let component: ViewStudioComponent;
  let fixture: ComponentFixture<ViewStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStudioComponent, HttpClientTestingModule, RouterTestingModule]
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
