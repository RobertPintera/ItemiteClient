import {Component, effect, inject, input, model, OnDestroy, signal} from '@angular/core';
import {Button} from "../../../shared/button/button";
import {CascadeSelect} from "../../../shared/cascade-select/cascade-select";
import {ComboBox} from "../../../shared/combo-box/combo-box";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GeoMapAutocomplete} from "../../../shared/geo-map-autocomplete/geo-map-autocomplete";
import {InputNumber} from "../../../shared/input-number/input-number";
import {MediaManager} from "../../../shared/media-manager/media-manager";
import {Router} from "@angular/router";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {CategoryService} from '../../../../core/services/category-service/category.service';
import {CategoryTreeDTO} from '../../../../core/models/category/CategoryTreeDTO';
import {OptionItem} from '../../../../core/models/OptionItem';
import {SelectNode} from '../../../../core/models/SelectNode';
import {Localization} from '../../../../core/models/location/Localization';
import {ImageMedia} from '../../../../core/models/graphics/ImageMedia';
import {AuctionListingDTO} from '../../../../core/models/auction-listing/AuctionListingDTO';
import {PutAuctionListingDTO} from '../../../../core/models/auction-listing/PutAuctionListingDTO';
import {AuctionListingService} from '../../../../core/services/auction-listing-service/auction-listing.service';
import {PostAuctionListingDTO} from '../../../../core/models/auction-listing/PostAuctionListingDTO';
import {Location} from '@angular/common';
import {LISTING_TYPES} from '../../../../core/constants/constants';
import {auctionDurationValidator, isEmptyValidator, localizationValidator} from '../../../../core/utility/Validation';
import {finalize, Subject, takeUntil} from 'rxjs';
import {CategoryDTO} from '../../../../core/models/category/CategoryDTO';

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
export class AuctionForm implements OnDestroy {
  private _auctionListingService = inject(AuctionListingService);
  private _categoryService = inject(CategoryService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _location = inject(Location);
  private _translator = inject(TranslateService);
  private _destroy$ = new Subject<void>();

  readonly loading = model.required<boolean>();
  readonly auction = input<AuctionListingDTO | null>(null);

  readonly categories = signal<CategoryTreeDTO | null>(null);

  readonly selectedMainCategory = signal<OptionItem>({key: '', value: ''});
  readonly selectedSubCategory = signal<OptionItem>({key: '', value: ''});

  readonly mainCategories = this._categoryService.mainCategories;

  readonly mainCategoriesOptions = signal<OptionItem[]>([]);
  readonly subCategoriesOptions = signal<SelectNode[] | undefined>(undefined);

  readonly form = this._formBuilder.group({
    name: new FormControl<string>('', [
      Validators.required,
      isEmptyValidator,
      Validators.minLength(2),
      Validators.maxLength(50)]
    ),
    startingBid: new FormControl<number>(0,[
      Validators.required,
      Validators.min(0.1),
      Validators.max(999999.99),
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
      Validators.maxLength(2500)
    ])
  });

  constructor() {
    effect(() =>  {
      const auction = this.auction();
      if (auction) {
        this.fillForm(auction);
      }
    });

    effect(() => {
      const categories = this.mainCategories();
      if (categories.length) {
        this.updateMainCategoriesOptions();
      }
    });

    this._translator.onLangChange
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.updateMainCategoriesOptions();
        this.updateSubCategoriesOptions();
        this.updateSelectedCategories();
      });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  selectMainCategory(option?: OptionItem){
    if (!option) return;
    this.form.get('subcategory')?.reset();

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

    this.loading.set(true);

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
        startingBid: this.form.value.startingBid ?? null,
        categoryId: Number(this.form.value.subcategory?.key ?? this.form.value.mainCategory?.key),
        dateEnds: this.form.value.dateEnds
          ? this.toUtcISOString(this.form.value.dateEnds)
          : '',
        existingPhotoIds: existingPhotoIds,
        existingPhotoOrders: existingPhotoOrders,
        newImages: newImages,
        newImageOrders: newImageOrders
      };

      this._auctionListingService.updateAuctionListing(auction.id ,payload).pipe(
        finalize(() => this.loading.set(false))
      ).subscribe(() => {
        void this._router.navigate(['/product'], { queryParams: { id: auction.id, type: LISTING_TYPES.AUCTION } });
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

      this._auctionListingService.createAuctionListing(payload).pipe(
        finalize(() => this.loading.set(false))
      ).subscribe(createdAuction => {
        void this._router.navigate(['/product'], { queryParams: { id: createdAuction.createdAuctionListingId, type:  LISTING_TYPES.AUCTION } });
      });
    }
  }

  private mapCategoryToSelectNode(category: CategoryTreeDTO): SelectNode {
    return {
      option: {
        key: category.id.toString(),
        value: this.getCategoryName(category)
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

    if(auction.currentBid){
      this.form.get('startingBid')?.disable();
    }

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
      value: this.getCategoryName(main)
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
      value: this.getCategoryName(sub)
    };

    this.form.get('subcategory')?.setValue(subOption);
  }

  private toUtcISOString(date: string): string {
    return new Date(date).toISOString();
  }

  private updateMainCategoriesOptions() {
    const options = this.mainCategories().map(category => ({
      key: category.id.toString(),
      value: this.getCategoryName(category)
    }));
    this.mainCategoriesOptions.set(options);
  }

  private updateSubCategoriesOptions() {
    const categories = this.categories();
    if (categories && categories.subCategories) {
      const subCategoriesNodes = categories.subCategories.map(cat =>
        this.mapCategoryToSelectNode(cat)
      );
      this.subCategoriesOptions.set(subCategoriesNodes);
    }
  }
  private updateSelectedCategories() {
    // Aktualizuj główną kategorię
    const mainCategoryControl = this.form.get('mainCategory');
    const currentMainCategory = mainCategoryControl?.value;
    if (currentMainCategory) {
      const category = this.mainCategories().find(c => c.id.toString() === currentMainCategory.key);
      if (category) {
        const updatedMainOption = {
          key: currentMainCategory.key,
          value: this.getCategoryName(category)
        };
        this.selectedMainCategory.set(updatedMainOption);
      }
    }

    const subCategoryControl = this.form.get('subcategory');
    const currentSubCategory = subCategoryControl?.value;
    if (currentSubCategory) {
      const subCategory = this.findCategoryById(this.categories(), currentSubCategory.key);
      if (subCategory) {
        const updatedSubOption = {
          key: currentSubCategory.key,
          value: this.getCategoryName(subCategory)
        };
        this.selectedSubCategory.set(updatedSubOption);
        subCategoryControl.setValue(updatedSubOption);
      }
    }
  }

  getCategoryName(category: CategoryDTO): string {
    return this._translator.getCurrentLang() === 'pl'
      ? category.polishName
      : category.name;
  }

  private findCategoryById(categoryTree: CategoryTreeDTO | null, id: string): CategoryTreeDTO | null {
    if (!categoryTree) return null;

    if (categoryTree.id.toString() === id) {
      return categoryTree;
    }

    if (categoryTree.subCategories) {
      for (const subCat of categoryTree.subCategories) {
        const found = this.findCategoryById(subCat, id);
        if (found) return found;
      }
    }

    return null;
  }
}
