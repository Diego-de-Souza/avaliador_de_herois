import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CardQuizLevelComponent } from './card-quiz-level.component';

describe('CardQuizLevelComponent', () => {
  let component: CardQuizLevelComponent;
  let fixture: ComponentFixture<CardQuizLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardQuizLevelComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardQuizLevelComponent);
    component = fixture.componentInstance;
    // Initialize required inputs
    component.level = {
      id: 1,
      name: 'Test Level',
      unlocked: true,
      difficulty: 'easy'
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
