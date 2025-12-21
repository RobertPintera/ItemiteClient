import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItem } from './purchase-item';

describe('PurchaseItem', () => {
  let component: PurchaseItem;
  let fixture: ComponentFixture<PurchaseItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseItem]
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
