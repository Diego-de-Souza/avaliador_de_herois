import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ArtigosComponent } from './artigos.component';

describe('ArtigosComponent', () => {
  let component: ArtigosComponent;
  let fixture: ComponentFixture<ArtigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtigosComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
