import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboBox } from './combo-box';

describe('ComboBox', () => {
  let component: ComboBox;
  let fixture: ComponentFixture<ComboBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
