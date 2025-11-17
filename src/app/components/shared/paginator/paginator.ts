import {Component, effect, input, model, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-paginator',
  imports: [
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  readonly pageNumber = model<number>(1);
  readonly totalPages = input<number>(1);

  readonly pageChange = output<number>();

  readonly previousPage = signal<number>(1);
  readonly currentPage = signal<number>(1);

  constructor() {
    effect(() => {
      const page = this.pageNumber();
      this.previousPage.set(page);
      this.currentPage.set(page);
    });
  }

  goToPage(pageNumber: number) {
    let page = isNaN(pageNumber) ? this.previousPage() : pageNumber;

    if (page < 1) page = 1;
    else if (page > this.totalPages()) page = this.totalPages();

    this.currentPage.set(page);
    if (page === this.previousPage()) return;

    this.previousPage.set(page);
    this.pageChange.emit(page);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
    if (allowedKeys.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
