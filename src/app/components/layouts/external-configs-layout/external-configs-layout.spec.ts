import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalConfigsLayout } from './external-configs-layout';

describe('ExternalConfigsLayout', () => {
  let component: ExternalConfigsLayout;
  let fixture: ComponentFixture<ExternalConfigsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalConfigsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalConfigsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
