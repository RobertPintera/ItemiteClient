export interface PostAdminPanelCategoryDTO {
  "name": string;
  "description": string;
  "parentCategoryId"?: number | null;
  "svgImage": File | null;
}
