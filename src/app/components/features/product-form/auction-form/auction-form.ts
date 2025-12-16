import {Component, effect, inject, input, signal} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {CascadeSelect} from "../../../shared/cascade-select/cascade-select";
import {ComboBox} from "../../../shared/combo-box/combo-box";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GeoMapAutocomplete} from "../../../shared/geo-map-autocomplete/geo-map-autocomplete";
import {InputNumber} from "../../../shared/input-number/input-number";
import {MediaManager} from "../../../shared/media-manager/media-manager";
import {Router} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {CategoryTreeDTO} from '../../../../core/models/CategoryTreeDTO';
import {OptionItem} from '../../../../core/models/OptionItem';
import {SelectNode} from '../../../../core/models/SelectNode';
import {Localization} from '../../../../core/models/Localization';
import {ImageMedia} from '../../../../core/models/ImageMedia';
import {AuctionListingDTO} from '../../../../core/models/AuctionListingDTO';
import {PutAuctionListingDTO} from '../../../../core/models/PutAuctionListingDTO';
import {AuctionListingService} from '../../../../core/services/auction-listing-service/auction-listing.service';
import {PostAuctionListingDTO} from '../../../../core/models/PostAuctionListingDTO';
import {Location} from '@angular/common';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {auctionDurationValidator, isEmptyValidator, localizationValidator} from '../../../../core/utility/Validation';

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
    TranslatePipe
  ],
  templateUrl: './auction-form.html',
  styleUrl: './auction-form.css'
})
export class AuctionForm {
  private _auctionListingService = inject(AuctionListingService);
  private _categoryService = inject(CategoryService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _location = inject(Location);

  readonly auction = input<AuctionListingDTO | null>(null);

  readonly categories = signal<CategoryTreeDTO | null>(null);

  readonly selectedMainCategory = signal<OptionItem>({key: '', value: ''});
  readonly selectedSubCategory = signal<OptionItem>({key: '', value: ''});

  readonly isSubmitting = signal<boolean>(false);
  readonly submitError = signal<string | null>(null);

  readonly mainCategories = this._categoryService.mainCategories();

  readonly mainCategoriesOptions: OptionItem[] = this.mainCategories.map(cat => ({
    key: cat.id.toString(),
    value: "categories." + cat.name
  }));
  readonly subCategoriesOptions = signal<SelectNode[] | undefined>(undefined);

  readonly form = this._formBuilder.group({
    name: new FormControl<string>('', [
      Validators.required,
      isEmptyValidator,
      Validators.minLength(2),
      Validators.maxLength(30)]
    ),
    startingBid: new FormControl<number>(0,[
      Validators.required,
      Validators.min(0),
      Validators.max(100000),
      Validators.pattern(/^\d+(\.\d{1,2})?$/)
    ]),
    dateEnds: new FormControl<string | null>(null, [
      Validators.required,
      auctionDurationValidator(1)
    ]),
    mainCategory: new FormControl<OptionItem | null>(null, Validators.required),
    subcategory:new FormControl<OptionItem | null>({value: null, disabled: true}, Validators.required),
    localization: new FormControl<Localization | null>(null, [
      Validators.required,
      localizationValidator()
    ]),
    images: new FormControl<ImageMedia[]>([], Validators.required),
    description: new FormControl<string>('', [
      Validators.required,
      isEmptyValidator,
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
    this._categoryService.loadCategoryTree(id).subscribe({
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

  cancel(){
    this._location.back();
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
        dateEnds: this.form.value.dateEnds
          ? this.toUtcISOString(this.form.value.dateEnds)
          : '',
        existingPhotoIds: existingPhotoIds,
        existingPhotoOrders: existingPhotoOrders,
        newImages: newImages,
        newImageOrders: newImageOrders
      };

      console.log(this.form.value.dateEnds);

      this._auctionListingService.updateAuctionListing(auction.id ,payload).subscribe({
        next: _ => {
          this.isSubmitting.set(false);
          void this._router.navigate(['/product'], { queryParams: { id: auction.id, type: LISTING_TYPES.AUCTION } });
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
        dateEnds: this.form.value.dateEnds
          ? this.toUtcISOString(this.form.value.dateEnds)
          : '',
        categoryId: Number(this.form.value.subcategory?.key ?? this.form.value.mainCategory?.key),
        images: imageFiles,
        imageOrders: imageOrders,
      };

      this._auctionListingService.createAuctionListing(payload).subscribe({
        next: createdAuction => {
          this.isSubmitting.set(false);
          void this._router.navigate(['/product'], { queryParams: { id: createdAuction.createdAuctionListingId, type:  LISTING_TYPES.AUCTION } });
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
        value: "categories." + category.name
      },
      childrenNodes: category.subCategories?.map(cat => this.mapCategoryToSelectNode(cat)) || []
    };
  }

  private fillForm(auction: AuctionListingDTO) {
    this.form.patchValue({
      name: auction.name,
      startingBid: auction.startingBid,
      description: auction.description,
    });

    const dateLocal = new Date(auction.dateEnds)
      .toISOString()
      .slice(0, 16); // YYYY-MM-DDTHH:mm

    this.form.patchValue({ dateEnds: dateLocal });

    const localization: Localization = {
      country: auction.location.country,
      state: auction.location.state,
      formatted: `${auction.location.city}, ${auction.location.state}, ${auction.location.country}`,
      city: auction.location.city,
      latitude: auction.location.latitude,
      longitude: auction.location.longitude,
    };

    this.form.get('localization')?.setValue(localization);

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
      value: "categories." + main.name
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
      value: "categories." + sub.name
    };

    this.form.get('subcategory')?.setValue(subOption);
  }

  private toUtcISOString(date: string): string {
    const local = date.length === 10
      ? new Date(date + 'T00:00:00')
      : new Date(date);

    return new Date(
      Date.UTC(
        local.getFullYear(),
        local.getMonth(),
        local.getDate(),
        local.getHours(),
        local.getMinutes(),
        0,
        0
      )
    ).toISOString();
  }
}
