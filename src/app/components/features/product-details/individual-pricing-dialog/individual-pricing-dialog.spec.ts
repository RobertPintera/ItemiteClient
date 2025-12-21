import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualPricingDialog } from './individual-pricing-dialog';

describe('IndividualPricingDialog', () => {
  let component: IndividualPricingDialog;
  let fixture: ComponentFixture<IndividualPricingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualPricingDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualPricingDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
