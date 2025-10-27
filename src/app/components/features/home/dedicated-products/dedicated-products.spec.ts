import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DedicatedProducts } from './dedicated-products';

describe('DedicatedProducts', () => {
  let component: DedicatedProducts;
  let fixture: ComponentFixture<DedicatedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DedicatedProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DedicatedProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
