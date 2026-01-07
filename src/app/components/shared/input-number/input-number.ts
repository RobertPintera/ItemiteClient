import {Component, input, model, output, signal} from '@angular/core';
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

  readonly min = input<number | null>(0);
  readonly max = input<number | null>(100);
  readonly step = input<number>(1);
  readonly decimalPlaces = input<number>(2);
  readonly placeholder = input<string>('');

  readonly valueChange = output<number | null>();
  readonly enterPressed = output<number | null>();
  readonly blurInput = output<number | null>();

  readonly disabled = signal<boolean>(false);

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

    if (key === '.' || key === ',') {
      if (/[.,]/.test(value)) {
        event.preventDefault();
        return;
      }
    }

    const separatorIndex = value.indexOf('.') !== -1
      ? value.indexOf('.')
      : value.indexOf(',');

    if (separatorIndex !== -1) {
      const decimals = value.length - separatorIndex - 1;
      if (decimals >= this.decimalPlaces()) {
        event.preventDefault();
        return;
      }
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
    const min = this.min();
    const max = this.max();

    if (min !== null) {
      numericValue = Math.max(numericValue, min);
    }
    if (max !== null) {
      numericValue = Math.min(numericValue, max);
    }

    this.value.set(numericValue);
    input.value = numericValue.toFixed(this.decimalPlaces());
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
    this.disabled.set(isDisabled);
  }
  // -------------------

  private incrementValue() {
    let value = this.value() ?? 0;
    value = this.roundToStep(value + this.step());

    const max = this.max();
    if (max !== null) {
      value = Math.min(value, max);
    }

    this.setValue(value);
  }

  private decrementValue() {
    let value = this.value() ?? 0;
    value = this.roundToStep(value - this.step());

    const min = this.min();
    if (min !== null) {
      value = Math.max(value, min);
    }

    this.setValue(value);
  }

  private roundToStep(value: number): number {
    const precision = Math.max(
      this.decimalPlaces(),
      this.step().toString().split('.')[1]?.length ?? 0
    );
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  private setValue(val: number) {
    this.value.set(val);
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouched();
  }
}
