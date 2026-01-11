import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidHistoryDialog } from './bid-history-dialog';
import {TranslateModule} from '@ngx-translate/core';
import {inputBinding, signal} from '@angular/core';

describe('BidHistoryDialog', () => {
  let component: BidHistoryDialog;
  let fixture: ComponentFixture<BidHistoryDialog>;

  const id = signal<number>(1);
  const isOpen = signal<boolean>(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidHistoryDialog, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BidHistoryDialog, {
      bindings: [
        inputBinding('id',id),
        inputBinding('isOpen',isOpen)
      ]
    });

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
