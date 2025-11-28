import {Component, inject, signal,} from '@angular/core';
import {Button} from '../../shared/button/button';
import {CascadeSelect} from '../../shared/cascade-select/cascade-select';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {OptionItem} from '../../../core/models/OptionItem';
import {CategoryTreeDTO} from '../../../core/models/CategoryTreeDTO';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {SelectNode} from '../../../core/models/SelectNode';
import {MediaManager} from '../../shared/media-manager/media-manager';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Localization} from '../../../core/models/Localization';
import {GeoMapAutocomplete} from '../../shared/geo-map-autocomplete/geo-map-autocomplete';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-product-form',
  imports: [
    Button,
    CascadeSelect,
    ComboBox,
    MediaManager,
    ReactiveFormsModule,
    GeoMapAutocomplete,
    TranslatePipe
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm{
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);

  readonly categories = signal<CategoryTreeDTO | null>(null);

  readonly selectedMainCategory = signal<OptionItem>({key: '', value: ''});
  readonly selectedSubCategory = signal<OptionItem>({key: '', value: ''});

  readonly mainCategories = this.categoryService.mainCategories();

  readonly mainCategoriesOptions: OptionItem[] = this.mainCategories.map(cat => ({
    key: cat.id.toString(),
    value: cat.name
  }));
  readonly subCategoriesOptions = signal<SelectNode[] | undefined>(undefined);

  readonly form = this.formBuilder.group({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200)]
    ),
    price: new FormControl<number>(0,[
      Validators.required,
      Validators.min(0),
      Validators.max(1000000),
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
    mainCategory: new FormControl<OptionItem | null>(null, Validators.required),
    subcategory:new FormControl<OptionItem | null>({value: null, disabled: true}, Validators.required),
    isNegotiable: new FormControl<boolean>(false),
    localization: new FormControl<Localization | null>(null, Validators.required),
    images: new FormControl([]),
    description: new FormControl<string>('')
  });

  selectMainCategory(option?: OptionItem){
    if (!option) return;

    this.selectedMainCategory.set(option);
    const id = Number(option.key);
    this.categoryService.loadCategoryTree(id).subscribe({
      next: tree => {
        this.categories.set(tree);

        const subCategoriesNodes: SelectNode[] = tree.subCategories?.map(cat => this.mapCategoryToSelectNode(cat)) || [];
        this.subCategoriesOptions.set(subCategoriesNodes);

        if (subCategoriesNodes.length) {
          this.form.get('subcategory')?.enable();
        } else {
          this.form.get('subcategory')?.disable();
          this.form.get('subcategory')?.reset();
        }
      },
      error: err => console.error(err)
    });

    this.form.get('mainCategory')?.setValue(option);
  }

  selectSubCategory(option?: OptionItem){
    if (!option) return;

    this.selectedSubCategory.set(option);
  }


  private mapCategoryToSelectNode(category: CategoryTreeDTO): SelectNode {
    return {
      option: {
        key: category.id.toString(),
        value: category.name
      },
      childrenNodes: category.subCategories?.map(cat => this.mapCategoryToSelectNode(cat)) || []
    };
  }

  updateLocalization(localization: Localization | null): void {

  }


  submit(){

  }
}
