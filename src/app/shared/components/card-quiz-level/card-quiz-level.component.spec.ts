import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardQuizLevelComponent } from './card-quiz-level.component';

describe('CardQuizLevelComponent', () => {
  let component: CardQuizLevelComponent;
  let fixture: ComponentFixture<CardQuizLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardQuizLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardQuizLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
