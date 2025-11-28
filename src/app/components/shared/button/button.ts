import {Component,input, output, ViewEncapsulation} from '@angular/core';
import {BUTTON_SEVERITY, BUTTON_VARIANTS, ButtonSeverity, ButtonVariants} from '../../../core/constants/constants';

  @Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.html',
    styleUrl: './button.css',
    encapsulation: ViewEncapsulation.None
  })
export class Button {
  readonly label = input<string>('click');
  readonly type = input<"submit" | "reset" | "button">('button');
  readonly severity = input<ButtonSeverity>(BUTTON_SEVERITY.PRIMARY);
  readonly variant = input<ButtonVariants>(BUTTON_VARIANTS.FILLED);
  readonly isDisabled = input<boolean>(false);
  readonly clickButton = output<void>();

  onClick() {
    this.clickButton.emit();
  }

  get getClasses(): string {
    if(this.isDisabled())
      return 'button-' + BUTTON_SEVERITY.DISABLED + '-' + this.variant();

    return 'button-' + this.severity() + '-' + this.variant();
  }

  protected readonly BUTTON_SEVERITY = BUTTON_SEVERITY;
}
