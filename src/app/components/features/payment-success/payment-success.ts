import { Component } from '@angular/core';
import {Button} from "../../shared/button/button";
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [
    Button,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess {

}
