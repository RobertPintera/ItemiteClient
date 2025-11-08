import {Component, effect, input, signal, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-scaled-text',
  imports: [],
  templateUrl: './scaled-text.html',
  styleUrl: './scaled-text.css'
})
export class ScaledText {

  readonly text = input<string>('');

  // How much size increases for each screen size
  // (!) Negative step will decrease size each bigger screen size
  //     base is still indicates the smallest possible size
  readonly step = input<number>(1);

  // Smallest size of the text
  readonly base = input<
    'text-xs' | 'text-sm'| 'text-base'| 'text-lg'| 'text-xl' | 'text-2xl'|
    'text-3xl'| 'text-4xl'| 'text-5xl' | 'text-6xl'| 'text-7xl'|
    'text-8xl'| 'text-9xl'>('text-base')

  readonly maxGrowTimes = input<number>(12);

  private readonly _classSet = [
      'text-xs',
      'text-sm',
      'text-base',
      'text-lg',
      'text-xl',
      'text-2xl',
      'text-3xl',
      'text-4xl',
      'text-5xl',
      'text-6xl',
      'text-7xl',
      'text-8xl',
      'text-9xl',
  ];

  private readonly _deviceSize = [
    'sm:','md:','lg:','xl:','2xl:'
  ];

  classList: WritableSignal<string> =  signal('');

  constructor() {
    // Trigger classList update whenever any of the inputs change
    effect(() => {
      this.classList.set(this.getClassSet()); // Assign result of getClassSet() to classList
    });
  }

  getClassSet(): string {

    // classSet index out of range, return only base
    if(this.step() > this._classSet.length - 1) {
      return this.base();
    }

    // Get next text size
    // Make sure index isn't out of range
    let index= this._classSet.indexOf(this.base()) + 1;
    index = Math.min(this._classSet.length-1, index + 1);

    // Calculate how many times size can change
    let changed = 0;

    // add base (smallest) screen size to css as default
    //     only when step is not negative
    let cssClassBuilder = this.step() >= 0 ?
      `${this.base()} ` : '';

    let lastAdded = '';

    for(let i = 0; i < this._deviceSize.length; i++) {

      // bigger screen size will have smaller fonts when step is negative
      let currentSize = this.step() >= 0 ?
        i : this._deviceSize.length - 1 - i;

      // make sure index is not out of range
      currentSize = Math.max(0, currentSize);

      lastAdded = this._classSet[index];
      cssClassBuilder += `${this._deviceSize[currentSize]}${this._classSet[index]} `;
      changed++;

      if(changed >= this.maxGrowTimes()) continue;

      index = Math.min(this._classSet.length-1, index + Math.abs(this.step()));
    }

    // Add max text size as default when step is negative
    if(this.step() < 0 ) cssClassBuilder += lastAdded;

    return cssClassBuilder;
  }
}
