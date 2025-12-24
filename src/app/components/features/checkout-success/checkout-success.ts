import { Component } from '@angular/core';
import {Button} from "../../shared/button/button";
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [
    Button,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css',
})
export class CheckoutSuccess {

}
