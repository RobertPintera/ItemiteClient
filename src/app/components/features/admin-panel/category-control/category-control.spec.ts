import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryControl } from './category-control';

describe('CategoryControl', () => {
  let component: CategoryControl;
  let fixture: ComponentFixture<CategoryControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryControl]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
