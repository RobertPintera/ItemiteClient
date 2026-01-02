import {CategoryDTO} from './CategoryDTO';
import {SafeHtml} from '@angular/platform-browser';

export interface CategoryView extends CategoryDTO {
  safeSvg: SafeHtml | null;
}
