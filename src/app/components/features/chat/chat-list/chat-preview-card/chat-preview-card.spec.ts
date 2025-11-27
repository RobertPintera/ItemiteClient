import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPreviewCard } from './chat-preview-card';

describe('ChatPreviewCard', () => {
  let component: ChatPreviewCard;
  let fixture: ComponentFixture<ChatPreviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPreviewCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPreviewCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
