import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {GeoapifyService} from '../../../core/services/geoapify-service/geoapify.service';
import {Localization} from '../../../core/models/Localization';

@Component({
  selector: 'app-geocoder-autocomplete',
  imports: [],
  templateUrl: './geocoder-autocomplete.html',
  styleUrl: './geocoder-autocomplete.css'
})
export class GeocoderAutocomplete  {
  private geoapifyService = inject(GeoapifyService);

  constructor() {
    effect(() => {
      // Don't emit new event when value is passed into the component (set address valid to false)
      // It only should update text field.
      this._isAddressValid = false;
      const external = this.externalSource()?.formatted;
      if(external){
        this.inputValue.set(external);
      }
    });
  }

  inputValue = model<string>("");

  readonly placeHolder = input('Enter city');
  readonly externalSource = input<Localization | undefined>();

  private _suggestions: WritableSignal<Localization[]> = signal([]);
  readonly hasSuggestions: Signal<boolean> = computed(() => this._suggestions().length > 0);

  private _isAddressValid = false;

  readonly selectedLocalization: WritableSignal<Localization | null> = signal(null);
  suggestions: Signal<Localization[]> = this._suggestions;

  // Listen to this signal to detect if address is valid
  readonly onCityPicked = output<Localization|null>();
  readonly onInputEnter = output<string>();

  InputValueChanged(inputEvent:Event) {
    // If user changed the text by hand, the adress is invalid.
    //  (there is no way to get LocationAutocomplete from user text)
    //  we need to invalidate the pole if this happens
    if(this._isAddressValid) {
      this._isAddressValid = false;
    }
    const textVal = (inputEvent.target as HTMLInputElement).value.trim();
    this.inputValue.set(textVal);
    if(textVal === '') {
      this._suggestions.set([]); // Clear suggestions if the input is empty
      return;
    }
    this.DebounceAutocomplete(textVal);
  }

  updateEnterInputValue(){
    this.onInputEnter.emit(this.inputValue());

    if(this.inputValue() !== this.selectedLocalization()?.formatted)
      this.selectedLocalization.set(null);

    this.onCityPicked.emit(this.selectedLocalization());
  }

  updateInputValue(value:string, index:number ) {
    this.inputValue.set(value);
    this.selectedLocalization.set(this._suggestions()[index]);
    this.onCityPicked.emit(this._suggestions()[index]);
    this.onInputEnter.emit(this.inputValue());
    this._isAddressValid = true;
  }

  // Debounced autocomplete method
  DebounceAutocomplete(query: string) {
    this.geoapifyService.DebounceAutocomplete(query, 'city').subscribe({
      next: (response) => {
        this._suggestions.set(response.suggestions);
      },
      error: (err) => {
        console.error('Error fetching autocomplete suggestions:', err);
      }
    });
  }
}
