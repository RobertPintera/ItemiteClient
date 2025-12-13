import {Component, input, model, output } from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

/* eslint-disable @typescript-eslint/no-empty-function */

@Component({
  selector: 'app-input-number',
  imports: [],
  templateUrl: './input-number.html',
  styleUrl: './input-number.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputNumber,
      multi: true
    }
  ]
})
export class InputNumber {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  readonly value = model<number | null>(null);

  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly placeholder = input<string>('');

  readonly valueChange = output<number | null>();
  readonly enterPressed = output<number | null>();
  readonly blurInput = output<number | null>();

  onKeyDown(event: KeyboardEvent) {
    this.onTouched();

    const allowedKeys = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter',
    ];

    if (event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.incrementValue();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrementValue();
      return;
    }

    if (allowedKeys.includes(event.key)) return;

    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;

    if (key === '-' && value.length === 0) return;

    if (!/[0-9.,]/.test(key)) {
      event.preventDefault();
      return;
    }

    if ((key === '.' && /[.,]/.test(value)) || (key === ',' && /[.,]/.test(value))) {
      event.preventDefault();
      return;
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let raw = input.value.trim();

    if (!raw) {
      this.onChange(null);
      this.onTouched();
      return;
    }
    raw = raw.replace(',', '.');

    const numericValue = parseFloat(raw);

    if (isNaN(numericValue)) {
      this.value.set(null);
      this.onChange(null);
      this.onTouched();
      return;
    }

    this.onChange(numericValue);
    this.onTouched();
  }



  private normalizeValue(input: HTMLInputElement) {
    let raw = input.value.trim();

    if (!raw) {
      this.value.set(null);
      this.onChange(null);
      this.onTouched();
      return;
    }

    //Change ',' to '.'
    raw = raw.replace(',', '.');

    let numericValue = parseFloat(raw);

    if (isNaN(numericValue)) {
      this.value.set(null);
      input.value = '';
      this.onChange(null);
      this.onTouched();
      return;
    }
    numericValue = Math.min(Math.max(numericValue, this.min()), this.max());

    this.value.set(numericValue);
    input.value = numericValue.toFixed(2);
    this.onChange(numericValue);
    this.onTouched();
    this.valueChange.emit(numericValue);
  }

  onBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    this.normalizeValue(input);
    this.onTouched();
    this.blurInput.emit(this.value());
  }

  onEnter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.normalizeValue(input);
    this.onTouched();
    this.enterPressed.emit(this.value());
  }

  // ------ forms -----
  writeValue(value: number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }
  // -------------------

  private incrementValue() {
    let val = this.value() ?? 0;
    val = this.roundToStep(val + this.step());
    val = Math.min(val, this.max());
    this.setValue(val);
  }

  private decrementValue() {
    let val = this.value() ?? 0;
    val = this.roundToStep(val - this.step());
    val = Math.max(val, this.min());
    this.setValue(val);
  }

  private roundToStep(value: number): number {
    const stepDecimals = this.step().toString().split('.')[1]?.length ?? 0;
    const factor = Math.pow(10, stepDecimals);
    return Math.round(value * factor) / factor;
  }

  private setValue(val: number) {
    this.value.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouched();
  }
}
