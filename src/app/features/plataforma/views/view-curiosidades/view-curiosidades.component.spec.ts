import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewCuriosidadesComponent } from './view-curiosidades.component';

describe('ViewCuriosidadesComponent', () => {
  let component: ViewCuriosidadesComponent;
  let fixture: ComponentFixture<ViewCuriosidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCuriosidadesComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCuriosidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
