import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLatest } from './payment-latest';

describe('PaymentLatest', () => {
  let component: PaymentLatest;
  let fixture: ComponentFixture<PaymentLatest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentLatest]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentLatest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
