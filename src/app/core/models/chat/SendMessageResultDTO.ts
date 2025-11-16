import {MessageResponse} from './MessageResponse';
import {PhotoUploadResultDTO} from '../PhotoUploadResultDTO';

export interface SendMessageResultDTO {
  message: MessageResponse,
  uploadResults: Array<PhotoUploadResultDTO>
}
