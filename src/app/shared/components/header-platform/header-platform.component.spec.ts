import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderPlatformComponent } from './header-platform.component';

describe('HeaderPlatformComponent', () => {
  let component: HeaderPlatformComponent;
  let fixture: ComponentFixture<HeaderPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPlatformComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
