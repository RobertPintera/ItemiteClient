import {Component, input, OnDestroy, output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  encapsulation: ViewEncapsulation.None,
})
export class Dialog implements OnDestroy {

  readonly header = input<string>();
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
