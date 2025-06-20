import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArtigosComponent } from './view-artigos.component';

describe('ViewArtigosComponent', () => {
  let component: ViewArtigosComponent;
  let fixture: ComponentFixture<ViewArtigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewArtigosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewArtigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
