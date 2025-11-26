import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachedFiles } from './attached-files';

describe('AttachedFiles', () => {
  let component: AttachedFiles;
  let fixture: ComponentFixture<AttachedFiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachedFiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachedFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
