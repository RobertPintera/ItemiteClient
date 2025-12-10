import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingChatContainer } from './floating-chat-container';

describe('FloatingChatContainer', () => {
  let component: FloatingChatContainer;
  let fixture: ComponentFixture<FloatingChatContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingChatContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingChatContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
