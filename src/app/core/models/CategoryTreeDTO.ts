import {CategoryDTO} from './CategoryDTO';

export interface CategoryTreeDTO extends CategoryDTO{
  subCategories: CategoryTreeDTO[]
}
