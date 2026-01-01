import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryControl } from './subcategory-control';

describe('SubcategoryControl', () => {
  let component: SubcategoryControl;
  let fixture: ComponentFixture<SubcategoryControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryControl]
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoryControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
