import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsMainWindow } from './chats-main-window';

describe('ChatsMainWindow', () => {
  let component: ChatsMainWindow;
  let fixture: ComponentFixture<ChatsMainWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsMainWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatsMainWindow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
