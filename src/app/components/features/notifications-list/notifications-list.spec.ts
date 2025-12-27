import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsList } from './notifications-list';

describe('NotificationsList', () => {
  let component: NotificationsList;
  let fixture: ComponentFixture<NotificationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
