import {BannerPosition} from '../../constants/constants';

export interface BannerDTO {
  id: number;
  name: string;
  dimensions: {
    width: number;
    height: number;
  },
  offset: {
    x: number;
    y: number;
  },
  position: BannerPosition;
  isActive: boolean;
  fileName: string;
  url: string;
  publicId: string;
  dateUploaded: string;
}
