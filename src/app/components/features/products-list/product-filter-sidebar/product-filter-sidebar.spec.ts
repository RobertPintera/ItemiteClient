import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFilterSidebar } from './product-filter-sidebar';
import {TranslateModule} from '@ngx-translate/core';

describe('ProductFilterSidebar', () => {
  let component: ProductFilterSidebar;
  let fixture: ComponentFixture<ProductFilterSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFilterSidebar, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
