import {Component, computed, effect, Input, input, output, Signal, signal, WritableSignal} from '@angular/core';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {Localization} from '../../../core/models/Localization';
import {debug} from 'node:util';

@Component({
  selector: 'app-geocoder-autocomplete',
  imports: [],
  templateUrl: './geocoder-autocomplete.html',
  styleUrl: './geocoder-autocomplete.css'
})
export class GeocoderAutocomplete  {
  constructor(private geoapify: GeoapifyService) {

    effect(() => {
      // Don't emit new event when value is passed into the component (set address valid to false)
      // It only should update text field.
      this._isAddressValid = false;
      this._inputValue.set(this.externalSource()?.formatted ?? "");
    });
  }

  readonly placeHolder = input('Enter city');
  readonly externalSource = input<Localization | undefined>();

  private _suggestions: WritableSignal<Localization[]> = signal([]);
  readonly hasSuggestions: Signal<boolean> = computed(() => this._suggestions().length > 0);

  private _inputValue: WritableSignal<string> = signal("");
  readonly inputValue: Signal<string> = this._inputValue.asReadonly();

  private _isAddressValid: boolean = false;

  suggestions: Signal<Localization[]> = this._suggestions;

  // Listen to this signal to detect if address is valid
  onCityPicked = output<Localization|null>();

  InputValueChanged(inputEvent:Event) {
    // If user changed the text by hand, the adress is invalid.
    //  (there is no way to get LocationAutocomplete from user text)
    //  we need to invalidate the pole if this happens
    if(this._isAddressValid) {
      this._isAddressValid = false;
    }
    const textVal = (inputEvent.target as HTMLInputElement).value.trim();
    this._inputValue.set(textVal);
    if(textVal === '') {
      this._suggestions.set([]); // Clear suggestions if the input is empty
      return;
    }
    this.DebounceAutocomplete(textVal);
  }

  updateInputValue(value:string, index:number ) {
    this._inputValue.set(value);
    this.onCityPicked.emit(this._suggestions()[index]);
    this._isAddressValid = true;
  }

  // Debounced autocomplete method
  DebounceAutocomplete(query: string) {
    this.geoapify.DebounceAutocomplete(query, 'city').subscribe({
      next: (response) => {
        this._suggestions.set(response.suggestions);
      },
      error: (err) => {
        console.error('Error fetching autocomplete suggestions:', err);
      }
    });
  }
}
