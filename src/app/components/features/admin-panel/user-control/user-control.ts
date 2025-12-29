import {Component, signal} from '@angular/core';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-user-control',
  imports: [],
  templateUrl: './user-control.html',
  styleUrl: './user-control.css',
})
export class UserControl {

  private _selectedDate = signal("");
  readonly selectedDate = this._selectedDate.asReadonly();

  ToIsoUtc(dateFromInput: string): string {
    const date = parseISO(dateFromInput);
    const now = new Date();

    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    )).toISOString();
  }

  OnDateChanged(event: Event) {
    const element = event.target as HTMLInputElement;
    this._selectedDate.set(this.ToIsoUtc(element.value));
  }
}
