import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductItem } from './user-product-item';

describe('UserProductItem', () => {
  let component: UserProductItem;
  let fixture: ComponentFixture<UserProductItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProductItem]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserProductItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
