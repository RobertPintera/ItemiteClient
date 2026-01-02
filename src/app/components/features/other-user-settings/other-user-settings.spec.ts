import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserSettings } from './other-user-settings';

describe('OtherUserSettings', () => {
  let component: OtherUserSettings;
  let fixture: ComponentFixture<OtherUserSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherUserSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherUserSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
