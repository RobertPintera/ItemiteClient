import {Component, effect, inject, input, signal} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {CascadeSelect} from "../../../shared/cascade-select/cascade-select";
import {ComboBox} from "../../../shared/combo-box/combo-box";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GeoMapAutocomplete} from "../../../shared/geo-map-autocomplete/geo-map-autocomplete";
import {InputNumber} from "../../../shared/input-number/input-number";
import {MediaManager} from "../../../shared/media-manager/media-manager";
import {Router, RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {CategoryTreeDTO} from '../../../../core/models/CategoryTreeDTO';
import {OptionItem} from '../../../../core/models/OptionItem';
import {SelectNode} from '../../../../core/models/SelectNode';
import {Localization} from '../../../../core/models/Localization';
import {localizationValidator} from '../../../../core/Utility/Validation';
import {ImageMedia} from '../../../../core/models/ImageMedia';
import {AuctionListingDTO} from '../../../../core/models/AuctionListingDTO';
import {PutAuctionListingDTO} from '../../../../core/models/PutAuctionListingDTO';
import {AuctionListingService} from '../../../../core/services/auction-listing-service/auction-listing.service';
import {PostAuctionListingDTO} from '../../../../core/models/PostAuctionListingDTO';

@Component({
  selector: 'app-auction-form',
  imports: [
    Button,
    CascadeSelect,
    ComboBox,
    FormsModule,
    GeoMapAutocomplete,
    InputNumber,
    MediaManager,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './auction-form.html',
  styleUrl: './auction-form.css'
})
export class AuctionForm {
  private auctionListingService = inject(AuctionListingService);
  private categoryService = inject(CategoryService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  readonly auction = input<AuctionListingDTO | null>(null);

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
    startingBid: new FormControl<number>(0,[
      Validators.required,
      Validators.min(0),
      Validators.max(100000),
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
    dateEnds: new FormControl<string | null>(null, Validators.required),
    mainCategory: new FormControl<OptionItem | null>(null, Validators.required),
    subcategory:new FormControl<OptionItem | null>({value: null, disabled: true}, Validators.required),
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
      const auction = this.auction();
      if (auction) {
        this.fillForm(auction);
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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const images: ImageMedia[] = this.form.value.images ?? [];

    const auction = this.auction();

    if(auction){
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

      const payload: PutAuctionListingDTO = {
        name: this.form.value.name ?? '',
        description: this.form.value.description ?? '',
        locationLongitude: this.form.value.localization?.longitude ?? 0,
        locationLatitude: this.form.value.localization?.latitude ?? 0,
        locationCountry: this.form.value.localization?.country ?? '',
        locationCity: this.form.value.localization?.city ?? '',
        locationState: this.form.value.localization?.state ?? '',
        startingBid: this.form.value.startingBid ?? 0,
        categoryId: Number(this.form.value.subcategory?.key ?? this.form.value.mainCategory?.key),
        existingPhotoIds: existingPhotoIds,
        existingPhotoOrders: existingPhotoOrders,
        newImages: newImages,
        newImageOrders: newImageOrders
      };

      this.auctionListingService.updateAuctionListing(auction.id ,payload).subscribe({
        next: updatedAuction => {
          this.isSubmitting.set(false);
          void this.router.navigate(['/product'], { queryParams: { id: auction.id, type: "Product" } });
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

      const payload: PostAuctionListingDTO = {
        name: this.form.value.name ?? '',
        description: this.form.value.description ?? '',
        locationLongitude: this.form.value.localization?.longitude ?? 0,
        locationLatitude: this.form.value.localization?.latitude ?? 0,
        locationCountry: this.form.value.localization?.country ?? '',
        locationCity: this.form.value.localization?.city ?? '',
        locationState: this.form.value.localization?.state ?? '',
        startingBid: this.form.value.startingBid ?? 0,
        dateEnds: this.form.value.dateEnds ?? '',
        categoryId: Number(this.form.value.subcategory?.key ?? this.form.value.mainCategory?.key),
        images: imageFiles,
        imageOrders: imageOrders,
      };

      this.auctionListingService.createAuctionListing(payload).subscribe({
        next: createdAuction => {
          this.isSubmitting.set(false);
          void this.router.navigate(['/product'], { queryParams: { id: createdAuction.createdAuctionListingId, type: "Product" } });
        },
        error: err => {
          this.isSubmitting.set(false);
          this.submitError.set(err?.message || 'Something went wrong');
        }
      });
    }
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

  private fillForm(auction: AuctionListingDTO) {
    this.form.patchValue({
      name: auction.name,
      startingBid: auction.startingBid,
      description: auction.description,
      localization: auction.location,
      dateEnds: auction.dateEnds
    });

    this.setCategories(auction);

    const mappedImages: ImageMedia[] = auction.images.map(img => ({
      imageId: img.imageId,
      imageUrl: img.imageUrl,
      imageOrder: img.imageOrder,
      existing: true
    }));

    this.form.get('images')?.setValue(mappedImages);
  }

  private setCategories(auction: AuctionListingDTO) {
    if (!auction.categories || auction.categories.length === 0) return;

    const main = auction.categories[0];
    const sub = auction.categories[auction.categories.length - 1];

    const mainOption = {
      key: main.id.toString(),
      value: main.name
    };

    this.selectMainCategory(mainOption);
    this.form.get('mainCategory')?.setValue(mainOption);

    if (auction.categories.length === 1) {
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
