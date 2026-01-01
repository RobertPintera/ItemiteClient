import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryDialog } from './subcategory-dialog';

describe('SubcategoryDialog', () => {
  let component: SubcategoryDialog;
  let fixture: ComponentFixture<SubcategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
