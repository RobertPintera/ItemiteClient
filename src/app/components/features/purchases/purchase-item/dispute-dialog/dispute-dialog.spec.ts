import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeDialog } from './dispute-dialog';

describe('DisputeDialog', () => {
  let component: DisputeDialog;
  let fixture: ComponentFixture<DisputeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(DisputeDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
