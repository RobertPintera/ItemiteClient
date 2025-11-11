import {Component, input, model, output } from '@angular/core';

@Component({
  selector: 'app-input-number',
  imports: [],
  templateUrl: './input-number.html',
  styleUrl: './input-number.css'
})
export class InputNumber {
  value = model<number | null>(null);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly placeholder = input<string>('');

  readonly valueChange = output<number | null>();
  readonly enterPressed = output<number | null>();
  readonly blurInput = output<number | null>();

  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter',
    ];

    if (allowedKeys.includes(event.key)) return;

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;

    if (!/[0-9.,]/.test(key)) {
      event.preventDefault();
      return;
    }

    if ((key === '.' && /[.,]/.test(value)) || (key === ',' && /[.,]/.test(value))) {
      event.preventDefault();
      return;
    }
  }

  private normalizeValue(input: HTMLInputElement) {
    let raw = input.value.trim();

    if (!raw) {
      this.value.set(null);
      return;
    }

    //Change ',' to '.'
    raw = raw.replace(',', '.');

    let numericValue = parseFloat(raw);

    if (isNaN(numericValue)) {
      this.value.set(null);
      input.value = '';
      return;
    }
    numericValue = Math.min(Math.max(numericValue, this.min()), this.max());

    this.value.set(numericValue);
    input.value = numericValue.toFixed(2);
    this.valueChange.emit(numericValue);
  }

  onBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    this.normalizeValue(input);
    this.blurInput.emit(this.value());
  }

  onEnter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.normalizeValue(input);
    this.enterPressed.emit(this.value());
  }

}
