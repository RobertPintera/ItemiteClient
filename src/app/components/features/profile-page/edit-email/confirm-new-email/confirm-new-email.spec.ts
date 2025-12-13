import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNewEmail } from './confirm-new-email';

describe('ConfirmNewEmail', () => {
  let component: ConfirmNewEmail;
  let fixture: ComponentFixture<ConfirmNewEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmNewEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmNewEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
