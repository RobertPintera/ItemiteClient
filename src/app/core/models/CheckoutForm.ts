import {FormControl} from '@angular/forms';
import {OptionItem} from './OptionItem';

export interface CheckoutForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  address: FormControl<string | null>;
  city: FormControl<string | null>;
  country: FormControl<OptionItem | null>;
  postalCode: FormControl<string | null>;
  bidAmount?: FormControl<number | null>;
}
