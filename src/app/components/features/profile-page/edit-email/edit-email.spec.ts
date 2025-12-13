import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmail } from './edit-email';

describe('EditEmail', () => {
  let component: EditEmail;
  let fixture: ComponentFixture<EditEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
