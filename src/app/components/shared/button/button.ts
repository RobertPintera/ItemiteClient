import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  readonly text = input<string>('click');
  readonly clickButton = output<void>();

  onClick() {
    this.clickButton.emit();
  }
}
