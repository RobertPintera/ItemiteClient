import {Component, input, output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  encapsulation: ViewEncapsulation.None
})
export class Button {
  readonly label = input<string>('click');
  readonly clickButton = output<void>();

  onClick() {
    this.clickButton.emit();
  }
}
