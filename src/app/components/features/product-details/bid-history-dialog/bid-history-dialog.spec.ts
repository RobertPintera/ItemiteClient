import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidHistoryDialog } from './bid-history-dialog';

describe('BidHistoryDialog', () => {
  let component: BidHistoryDialog;
  let fixture: ComponentFixture<BidHistoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidHistoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidHistoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
