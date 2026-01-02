export interface PutAdminPanelCategoryDTO {
  name: string;
  description: string;
  parentCategoryId?: number | null;
  svgImage: File | null;
}
