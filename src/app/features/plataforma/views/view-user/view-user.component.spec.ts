import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../../../../core/service/user/user.service';
import { CepService } from '../../../../core/service/cep/cep.service';
import { of } from 'rxjs';

import { ViewUserComponent } from './view-user.component';

describe('ViewUserComponent', () => {
  let component: ViewUserComponent;
  let fixture: ComponentFixture<ViewUserComponent>;

  beforeEach(async () => {
    // Mock localStorage
    localStorage.setItem('role', JSON.stringify({ id: 1, email: 'test@example.com' }));

    const userServiceMock = {
      getFindOneUser: jest.fn().mockReturnValue(of({ dataUnit: { fullname: 'Test User', nickname: 'testuser' } })),
      putUpdateUser: jest.fn().mockReturnValue(of({}))
    };

    const cepServiceMock = {
      buscarCep: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ViewUserComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: CepService, useValue: cepServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
