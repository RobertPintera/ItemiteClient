import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnProfileMenu } from './on-profile-menu';

describe('OnProfileMenu', () => {
  let component: OnProfileMenu;
  let fixture: ComponentFixture<OnProfileMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnProfileMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnProfileMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
