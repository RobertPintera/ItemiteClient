import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-combo-box',
  imports: [],
  templateUrl: './combo-box.html',
  styleUrl: './combo-box.css'
})
export class ComboBox {
  readonly options = input<string[]>([]);
  readonly selected = input<string | null>(null);

  readonly selectedChange = output<string>();

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedChange.emit(value);
  }
}
