import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoryDialog } from './main-category-dialog';

describe('MainCategoryDialog', () => {
  let component: MainCategoryDialog;
  let fixture: ComponentFixture<MainCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCategoryDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(MainCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
