import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAndPayments } from './billing-and-payments';

describe('BillingAndPayments', () => {
  let component: BillingAndPayments;
  let fixture: ComponentFixture<BillingAndPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAndPayments]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAndPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
