import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeSuccess } from './stripe-success';

describe('StripeSuccess', () => {
  let component: StripeSuccess;
  let fixture: ComponentFixture<StripeSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeSuccess]
    }).compileComponents();

    fixture = TestBed.createComponent(StripeSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
