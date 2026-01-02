import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentControl } from './payment-control';

describe('PaymentControl', () => {
  let component: PaymentControl;
  let fixture: ComponentFixture<PaymentControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentControl]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
