import { CategoryDTO } from "./category/CategoryDTO";

export interface OptionItem {
  key: string;
  value: string;
  data?: CategoryDTO
}
