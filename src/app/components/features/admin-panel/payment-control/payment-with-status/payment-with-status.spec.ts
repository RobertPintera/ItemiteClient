import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWithStatus } from './payment-with-status';

describe('PaymentWithStatus', () => {
  let component: PaymentWithStatus;
  let fixture: ComponentFixture<PaymentWithStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentWithStatus]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentWithStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
