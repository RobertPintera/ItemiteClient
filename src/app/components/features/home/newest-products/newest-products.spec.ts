import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestProducts } from './newest-products';

describe('NewestProducts', () => {
  let component: NewestProducts;
  let fixture: ComponentFixture<NewestProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewestProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewestProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
