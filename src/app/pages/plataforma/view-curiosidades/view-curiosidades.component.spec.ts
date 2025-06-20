import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCuriosidadesComponent } from './view-curiosidades.component';

describe('ViewCuriosidadesComponent', () => {
  let component: ViewCuriosidadesComponent;
  let fixture: ComponentFixture<ViewCuriosidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCuriosidadesComponent]
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
