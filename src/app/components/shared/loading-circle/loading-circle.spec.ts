import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingCircle } from './loading-circle';

describe('LoadingCircle', () => {
  let component: LoadingCircle;
  let fixture: ComponentFixture<LoadingCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingCircle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingCircle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
