import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItem } from './sale-item';

describe('SaleItem', () => {
  let component: SaleItem;
  let fixture: ComponentFixture<SaleItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItem]
    }).compileComponents();

    fixture = TestBed.createComponent(SaleItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
