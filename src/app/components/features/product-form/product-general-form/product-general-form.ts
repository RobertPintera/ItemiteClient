import {Component, effect, inject, input, signal} from '@angular/core';
import {ProductListingService} from '../../../../core/services/product-listing-service/product-listing.service';
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {CategoryTreeDTO} from '../../../../core/models/CategoryTreeDTO';
import {OptionItem} from '../../../../core/models/OptionItem';
import {SelectNode} from '../../../../core/models/SelectNode';
import {Localization} from '../../../../core/models/Localization';
import {ImageMedia} from '../../../../core/models/ImageMedia';
import {PostProductListingDTO} from '../../../../core/models/PostProductListingDTO';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from '../../../shared/button/button';
import {CascadeSelect} from '../../../shared/cascade-select/cascade-select';
import {ComboBox} from '../../../shared/combo-box/combo-box';
import {GeoMapAutocomplete} from '../../../shared/geo-map-autocomplete/geo-map-autocomplete';
import {MediaManager} from '../../../shared/media-manager/media-manager';
import {InputNumber} from '../../../shared/input-number/input-number';
import {localizationValidator} from '../../../../core/Utility/Validation';
import {ProductListingDTO} from '../../../../core/models/ProductListingDTO';
import {PutProductListingDTO} from '../../../../core/models/PutProductListingDTO';

@Component({
  selector: 'app-product-general-form',
  imports: [
    Button,
    CascadeSelect,
    ComboBox,
    FormsModule,
    GeoMapAutocomplete,
    MediaManager,
    ReactiveFormsModule,
    TranslatePipe,
    InputNumber,
    RouterLink
  ],
  templateUrl: './product-general-form.html',
  styleUrl: './product-general-form.css'
})
export class ProductGeneralForm {
  private productListingService = inject(ProductListingService);
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  readonly product = input<ProductListingDTO | null>(null);

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
      Validators.minLength(2),
      Validators.maxLength(30)]
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
    localization: new FormControl<Localization | null>(null, [
      Validators.required,
      localizationValidator()
    ]),
    images: new FormControl<ImageMedia[]>([], Validators.required),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(500)
    ])
  });

  constructor() {
    effect(() =>  {
      const product = this.product();
      if (product) {
        this.fillForm(product);
      }
    });
  }


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

    const images: ImageMedia[] = this.form.value.images ?? [];

    const product = this.product();

    if(product){
      const existingPhotoIds = images
        .filter(img => img.existing)
        .map(img => img.imageId);

      const existingPhotoOrders = images
        .filter(img => img.existing)
        .map(img => img.imageOrder);

      const newImages = images
        .filter(
          (img): img is ImageMedia & { imageFile: File } =>
            !img.existing && img.imageFile instanceof File
        )
        .map(img => img.imageFile);


      const newImageOrders = images
        .filter(img => !img.existing)
        .map(img => img.imageOrder);

      const payload: PutProductListingDTO = {
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
        existingPhotoIds: existingPhotoIds,
        existingPhotoOrders: existingPhotoOrders,
        newImages: newImages,
        newImageOrders: newImageOrders
      };

      console.log(existingPhotoIds);
      console.log(existingPhotoOrders);
      console.log(newImages);
      console.log(newImageOrders);

      this.productListingService.updateProductListing(product.id ,payload).subscribe({
        next: updatedProduct => {
          this.isSubmitting.set(false);
          void this.router.navigate(['/product'], { queryParams: { id: product.id, type: "Product" } });
        },
        error: err => {
          this.isSubmitting.set(false);
          this.submitError.set(err?.message || 'Something went wrong');
        }
      });
    }
    else{
      const images: ImageMedia[] = this.form.value.images ?? [];

      const imageFiles = (Array.isArray(images) ? images : [])
        .filter(
          (img): img is ImageMedia & { imageFile: File } =>
            !!img && img.imageFile instanceof File
        )
        .map(img => img.imageFile);


      const imageOrders = images.map(img => img.imageOrder);

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
          void this.router.navigate(['/product'], { queryParams: { id: createdProduct.createdProductListingId, type: "Product" } });
        },
        error: err => {
          this.isSubmitting.set(false);
          this.submitError.set(err?.message || 'Something went wrong');
        }
      });
    }
  }

  private fillForm(product: ProductListingDTO) {
    this.form.patchValue({
      name: product.name,
      price: product.price,
      description: product.description,
      isNegotiable: product.isNegotiable,
      localization: product.location
    });

    this.setCategories(product);

    const mappedImages: ImageMedia[] = product.images.map(img => ({
      imageId: img.imageId,
      imageUrl: img.imageUrl,
      imageOrder: img.imageOrder,
      existing: true
    }));

    this.form.get('images')?.setValue(mappedImages);
  }

  private setCategories(product: ProductListingDTO) {
    if (!product.categories || product.categories.length === 0) return;

    const main = product.categories[0];
    const sub = product.categories[product.categories.length - 1];

    const mainOption = {
      key: main.id.toString(),
      value: main.name
    };

    this.selectMainCategory(mainOption);
    this.form.get('mainCategory')?.setValue(mainOption);

    if (product.categories.length === 1) {
      this.form.get('subcategory')?.disable();
      this.form.get('subcategory')?.reset();
      return;
    }

    const subOption: OptionItem = {
      key: sub.id.toString(),
      value: sub.name
    };


    this.form.get('subcategory')?.setValue(subOption);
  }
}
