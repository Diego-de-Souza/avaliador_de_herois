import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeamComponent } from './view-team.component';

describe('ViewTeamComponent', () => {
  let component: ViewTeamComponent;
  let fixture: ComponentFixture<ViewTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
