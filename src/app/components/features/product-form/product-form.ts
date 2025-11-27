import { Component, inject,signal, } from '@angular/core';
import {Button} from '../../shared/button/button';
import {CascadeSelect} from '../../shared/cascade-select/cascade-select';
import {CategoryService} from '../../../core/services/category-service/category.service';
import {OptionItem} from '../../../core/models/OptionItem';
import {CategoryTreeDTO} from '../../../core/models/CategoryTreeDTO';
import {ComboBox} from '../../shared/combo-box/combo-box';
import {SelectNode} from '../../../core/models/SelectNode';
import {MediaManager} from '../../shared/media-manager/media-manager';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Localization} from '../../../core/models/Localization';
import {GeoMapAutocomplete} from '../../shared/geo-map-autocomplete/geo-map-autocomplete';

@Component({
  selector: 'app-product-form',
  imports: [
    Button,
    CascadeSelect,
    ComboBox,
    MediaManager,
    ReactiveFormsModule,
    GeoMapAutocomplete
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

  form = this.formBuilder.group({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(200)]
    ),
    price: new FormControl<number>(0,[
      Validators.min(0),
    ]),
    mainCategory: new FormControl<number>(0),
    subcategory: new FormControl(''),
    isNegotiable: new FormControl(''),
    localization: new FormControl(''),
    images: new FormControl([]),
    description: new FormControl('')
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
      },
      error: err => console.error(err)
    });
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
