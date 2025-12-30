import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalNotificationInput } from './global-notification-input';

describe('GlobalNotificationInput', () => {
  let component: GlobalNotificationInput;
  let fixture: ComponentFixture<GlobalNotificationInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalNotificationInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalNotificationInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
