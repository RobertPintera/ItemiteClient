import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextIconMenuItem } from './text-icon-menu-item';

describe('TextIconMenuItem', () => {
  let component: TextIconMenuItem;
  let fixture: ComponentFixture<TextIconMenuItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextIconMenuItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextIconMenuItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
