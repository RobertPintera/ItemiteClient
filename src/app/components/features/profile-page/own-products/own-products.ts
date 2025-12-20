import { Component } from '@angular/core';
import {Button} from "../../../shared/button/button";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-own-products',
  imports: [
    Button,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './own-products.html',
  styleUrl: './own-products.css',
})
export class OwnProducts {

}
