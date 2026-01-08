export interface PostAdminPanelCategoryDTO {
  name: string;
  polishName: string;
  description: string;
  parentCategoryId?: number | null;
  svgImage: File | null;
}
