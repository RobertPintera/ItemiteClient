import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIndividualPricingDialog } from './delete-individual-pricing-dialog';

describe('DeleteIndividualPricingDialog', () => {
  let component: DeleteIndividualPricingDialog;
  let fixture: ComponentFixture<DeleteIndividualPricingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteIndividualPricingDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteIndividualPricingDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
