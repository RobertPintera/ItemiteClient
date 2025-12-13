import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedProducts } from './followed-products';

describe('FollowedProducts', () => {
  let component: FollowedProducts;
  let fixture: ComponentFixture<FollowedProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowedProducts]
    }).compileComponents();

    fixture = TestBed.createComponent(FollowedProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
