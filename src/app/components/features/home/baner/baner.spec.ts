import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Baner } from './baner';

describe('Baner', () => {
  let component: Baner;
  let fixture: ComponentFixture<Baner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Baner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Baner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
