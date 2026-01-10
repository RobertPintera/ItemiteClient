import { Component } from '@angular/core';
import {Button} from '../../shared/button/button';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-stripe-success',
  imports: [
    Button,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './stripe-success.html',
  styleUrl: './stripe-success.css',
})
export class StripeSuccess {

}
