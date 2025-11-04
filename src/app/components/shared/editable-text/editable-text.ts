import {Component, computed, effect, input, OnInit, output, Signal, signal, WritableSignal} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup, ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import { UpdateErrorTranslations } from '../../../core/Utility/Validation';
import {errorTranslations} from '../../../core/constants/ErrorTranslations';

@Component({
  selector: 'app-editable-text',
  imports: [
    TranslatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './editable-text.html',
  styleUrl: './editable-text.css'
})
export class EditableText implements OnInit {
  // Inputs
  text = input<string>("");
  minLength = input(20);
  validators = input<ValidatorFn | ValidatorFn[] | undefined>([]);
  verticalLayout = input<boolean>(false);

  // Outputs
  onEdit = output<string>();

  processedText = computed(() =>
    this.text().padEnd(this.minLength(), ' ')
  );

  private _editing = signal(false);
  editing:Signal<boolean> = this._editing;

  private _unsaved = signal("");
  unsavedEdit = computed(() => this._unsaved().trim());

  writeUnsaved(text: string): void {
    const textVal = text.trim();
    this._unsaved.set(textVal);
  }

  handleEditCancelBtn() {
    this._editing.set(!this.editing());
    if(this.editing()) {
      this._unsaved.set(
        this.text().trim() === "----" ? "" : this.text().trim()
      );
      this.editForm.get("textField")?.setValue(this.unsavedEdit());
      this.UpdateErrors();
    }
  }

  //////////
  // form //
  //////////

  editForm: FormGroup;
  private _formErrors:WritableSignal<string[]> = signal([]);
  formErrors: Signal<string[]> = this._formErrors;
  hasErrors = computed(()=> this.formErrors().length != 0);

  constructor(private translate: TranslateService) {
    // Form
    this.editForm = new FormGroup({
      "textField" : new FormControl(this.processedText(),
        this.validators())
    });

    effect(() => {
      this.editForm.clearValidators();
      const validators = this.validators();
      if(validators) {
        this.editForm.get("textField")?.addValidators(validators);
        this.editForm.updateValueAndValidity();
      }
    });

    // Subscribe to follow error translations
    //    Change will happen when error list is updated

    this.translate.onLangChange.subscribe(() => {
      UpdateErrorTranslations(this.translate);
    });
  }

  onSubmit() {
    if(!this.editForm.valid) {
      return;
    }
    this._editing.set(false);
    this.onEdit.emit(this.unsavedEdit());
  }

  /////////////////
  // Form errors //
  /////////////////


  ngOnInit() {
    this.editForm.get('textField')?.valueChanges.subscribe((value:string) => {
      this.writeUnsaved(value);
      this.UpdateErrors();
    });
  }

  private UpdateErrors() {
    const control = this.editForm.get('textField');
    const errors: string[] = [];

    if (control?.hasError('required')) {
      const translation:string = errorTranslations.get("field_empty") ?? "";
      if(translation != "") {
        errors.push(translation);
      }
    }

    if (control?.hasError('minlength')) {
      const translation:string = errorTranslations.get("field_min_len") ?? "";
      if(translation != "") {
        errors.push(translation);
      }
    }

    if (control?.hasError('maxlength')) {
      const translation:string = errorTranslations.get("field_max_len") ?? "";
      if(translation != "") {
        errors.push(translation);
      }
    }

    if (control?.hasError('pattern') || control?.hasError('email')) {
      const translation:string = errorTranslations.get("field_regex") ?? "";
      if(translation != "") {
        errors.push(translation);
      }
    }

    this._formErrors.set(errors);
  }
}
