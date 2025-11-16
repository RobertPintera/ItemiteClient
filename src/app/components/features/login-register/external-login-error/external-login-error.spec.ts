import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginError } from './external-login-error';

describe('GoogleLoginError', () => {
  let component: ExternalLoginError;
  let fixture: ComponentFixture<ExternalLoginError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalLoginError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalLoginError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
