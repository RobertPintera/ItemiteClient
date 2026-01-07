import {Component, input} from '@angular/core';
import {BannerDTO} from '../../../../core/models/banners/BannerDTO';

@Component({
  selector: 'app-baner',
  imports: [],
  templateUrl: './baner.html',
  styleUrl: './baner.css'
})
export class Baner {

  readonly banner = input.required<BannerDTO | null>();
}
