import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCase',
})
export class SnakeCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/([A-Z])/g, (match, p1, offset) => (offset > 0 ? '_' : '') + p1).toLowerCase();
  }
}
