import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControl } from './user-control';

describe('UserControl', () => {
  let component: UserControl;
  let fixture: ComponentFixture<UserControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
