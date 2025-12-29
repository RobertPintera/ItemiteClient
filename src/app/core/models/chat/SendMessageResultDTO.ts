import {MessageResponse} from './MessageResponse';
import {PhotoUploadResultDTO} from '../graphics/PhotoUploadResultDTO';

export interface SendMessageResultDTO {
  message: MessageResponse,
  uploadResults: Array<PhotoUploadResultDTO>
}
