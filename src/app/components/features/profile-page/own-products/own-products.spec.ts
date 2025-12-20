import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProducts } from './own-products';

describe('OwnProducts', () => {
  let component: OwnProducts;
  let fixture: ComponentFixture<OwnProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
