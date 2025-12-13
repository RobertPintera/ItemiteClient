import {
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  SecurityContext,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Button} from '../button/button';

@Component({
  selector: 'app-file-upload',
  imports: [
    TranslatePipe,
  ],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload {
  private _sanitizer: DomSanitizer = inject(DomSanitizer);

  onConfirmClicked = output<File>();
  onCancelClicked = output<void>();
  readonly acceptedFormats = input("image/png, image/jpeg");
  readonly supportsPreview = input<boolean>(false);
  readonly maxSizeMB  = input<number>(5);
  readonly fileSizeExceeded = computed(() => {
    if(!this.file()) return false;
    return this._file()!.size*0.000001 > this.maxSizeMB();
  });

  private _file : WritableSignal<File | undefined> = signal(undefined);
  readonly file: Signal<File | undefined> = this._file.asReadonly();

  readonly type = computed(() => this._file()?.type);
  readonly name = computed(() => this._file()?.name);
  readonly size = computed(() => {
    if(this._file()) {
      return `${this._file()!.size * 0.000001} MB`;
    } else {
      return "";
    }
  });
  readonly invalid = computed(() =>
    this.fileSizeExceeded() ||
    !this.file()
  );

  private _preview: WritableSignal<string | undefined> = signal(undefined);
  readonly preview: Signal<string> = computed(() => this._preview() ?? "");

  OnConfirmClicked() {
    if(this._preview()) {
      URL.revokeObjectURL(this._preview() as string);
    }

    if(this.invalid()) return;

    this.onConfirmClicked.emit(this._file()!);
  }

  OnCancelClicked() {
    if(this._preview()) {
      URL.revokeObjectURL(this._preview() as string);
    }
    this.onCancelClicked.emit();
  }

  OnFileChange(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;

    this._file.set(file);
    if(!this.supportsPreview()) return;

    if(this._preview()) {
      URL.revokeObjectURL(this._preview() as string);
    }
    const objectUrl = URL.createObjectURL(file);
    this._preview.set(this._sanitizer.sanitize(SecurityContext.URL, objectUrl) as SafeUrl);
  }
}
