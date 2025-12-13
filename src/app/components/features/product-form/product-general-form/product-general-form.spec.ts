import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGeneralForm } from './product-general-form';

describe('ProductGeneralForm', () => {
  let component: ProductGeneralForm;
  let fixture: ComponentFixture<ProductGeneralForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGeneralForm]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductGeneralForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
