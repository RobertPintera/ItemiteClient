import {UserBasicInfo} from '../user/UserBasicInfo';
import {ResourceType} from '../../constants/constants';

export interface Report {
  id: 1,
  content: string,
  createdAt: string,
  reportedResource: ResourceType,
  reportSubmitter: UserBasicInfo,
  imagesUrls: string[]
}
