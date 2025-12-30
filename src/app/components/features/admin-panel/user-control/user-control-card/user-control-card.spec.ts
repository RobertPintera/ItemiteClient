import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControlCard } from './user-control-card';

describe('UserControlCard', () => {
  let component: UserControlCard;
  let fixture: ComponentFixture<UserControlCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControlCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControlCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
