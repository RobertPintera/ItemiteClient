import {Component, input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {
  readonly items = input<any[]>([]);


  next(){

  }
  prev(){

  }
}
