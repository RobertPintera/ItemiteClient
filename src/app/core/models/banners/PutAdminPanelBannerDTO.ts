export interface PutAdminPanelBannerDTO {
  name: string;
  offsetX: number;
  offsetY: number;
  position: string;
  isActive: boolean;
  photo: File | null;
}
