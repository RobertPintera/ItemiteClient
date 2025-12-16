import {Component, input, output} from '@angular/core';
import {RouterLink, UrlTree} from '@angular/router';

@Component({
  selector: 'app-text-icon-menu-item',
  imports: [
    RouterLink
  ],
  templateUrl: './text-icon-menu-item.html',
  styleUrl: './text-icon-menu-item.css',
})
export class TextIconMenuItem {
  readonly text = input.required<string>();
  readonly route = input<readonly any[] | string | UrlTree | null | undefined>();
  onClicked = output<void>();
  OnClicked() {
    this.onClicked.emit();
  }
}
