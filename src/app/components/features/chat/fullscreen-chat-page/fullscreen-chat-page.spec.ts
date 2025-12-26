import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenChatPage } from './fullscreen-chat-page';

describe('FullscreenChatPage', () => {
  let component: FullscreenChatPage;
  let fixture: ComponentFixture<FullscreenChatPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullscreenChatPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullscreenChatPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
