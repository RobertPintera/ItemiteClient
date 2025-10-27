import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaledText } from './scaled-text';

describe('ScaledText', () => {
  let component: ScaledText;
  let fixture: ComponentFixture<ScaledText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaledText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaledText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
