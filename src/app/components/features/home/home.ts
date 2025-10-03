import { Component } from '@angular/core';
import {Baner} from './baner/baner';
import {Categories} from './categories/categories';

@Component({
  selector: 'app-home',
  imports: [
    Baner,
    Categories
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
