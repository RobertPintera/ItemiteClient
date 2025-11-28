import {Component, OnDestroy, output} from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css'
})
export class Dialog implements OnDestroy {
  readonly closed = output<void>();

  constructor() {
    document.body.style.overflow = 'hidden';
  }

  close() {
    document.body.style.overflow = 'auto';
    this.closed.emit();
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
  }
}
