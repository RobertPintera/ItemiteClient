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
import {ProductListingService} from '../../../core/services/product-listing-service/product-listing.service';
import {PostProductListingDTO} from '../../../core/models/PostProductListingDTO';
import {Router} from '@angular/router';
import {ImageMedia} from '../../../core/models/ImageMedia';

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
  private productListingService = inject(ProductListingService);
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  readonly categories = signal<CategoryTreeDTO | null>(null);

  readonly selectedMainCategory = signal<OptionItem>({key: '', value: ''});
  readonly selectedSubCategory = signal<OptionItem>({key: '', value: ''});

  readonly isSubmitting = signal<boolean>(false);
  readonly submitError = signal<string | null>(null);

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
    images: new FormControl<ImageMedia[]>([], Validators.required),
    description: new FormControl<string>('', Validators.required)
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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const imageFiles: File[] = this.form.value.images
      ?.map(img => img.imageFile)
      .filter((f): f is File => !!f) ?? [];

    const imageOrders = this.form.value.images?.map((img: ImageMedia) => img.imageOrder) ?? [];

    const payload: PostProductListingDTO = {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      locationLongitude: this.form.value.localization?.longitude ?? 0,
      locationLatitude: this.form.value.localization?.latitude ?? 0,
      locationCountry: this.form.value.localization?.country ?? '',
      locationCity: this.form.value.localization?.city ?? '',
      locationState: this.form.value.localization?.state ?? '',
      price: this.form.value.price ?? 0,
      isNegotiable: this.form.value.isNegotiable ?? false,
      categoryId: Number(this.form.value.subcategory?.key ?? this.form.value.mainCategory?.key),
      images: imageFiles,
      imageOrders: imageOrders,
    };

    this.productListingService.createProductListing(payload).subscribe({
      next: createdProduct => {
        this.isSubmitting.set(false);
        this.router.navigate(['/product'], { queryParams: { id: createdProduct.createdProductListingId, type: "Product" } });
      },
      error: err => {
        this.isSubmitting.set(false);
        this.submitError.set(err?.message || 'Something went wrong');
      }
    });
  }
}
