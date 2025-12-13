import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascadeSelect } from './cascade-select';

describe('CascadeSelect', () => {
  let component: CascadeSelect;
  let fixture: ComponentFixture<CascadeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascadeSelect]
    }).compileComponents();

    fixture = TestBed.createComponent(CascadeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
