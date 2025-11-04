import {Component, input, output, ViewEncapsulation} from '@angular/core';
import {ButtonVariant} from '../../../core/constants/constants';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  encapsulation: ViewEncapsulation.None
})
export class Button {
  readonly label = input<string>('click');
  readonly variant = input<ButtonVariant>('primary');
  readonly clickButton = output<void>();

  onClick() {
    this.clickButton.emit();
  }

  get classesOfVariants(): string {
    switch (this.variant()) {
    case 'primary':
      return 'button-primary';
    case 'secondary':
      return ' button-secondary';
    default:
      return 'button-primary';
    }
  }
}
