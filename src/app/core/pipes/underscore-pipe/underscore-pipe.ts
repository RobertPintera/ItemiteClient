import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'underscore',
})
export class UnderscorePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '_');
  }
}
