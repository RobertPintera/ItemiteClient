import {Component, input, output} from '@angular/core';
import {ResourceType} from '../../../../../core/constants/constants';
import {UserBasicInfo} from '../../../../../core/models/user/UserBasicInfo';
import {DatePipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-report-card',
  imports: [
    DatePipe,
    TranslatePipe,
  ],
  templateUrl: './report-card.html',
  styleUrl: './report-card.css',
})
export class ReportCard {
  content = input.required<string>();
  createdAt = input.required<string>();
  reportedResource = input.required<ResourceType>();
  reportSubmitter = input.required<UserBasicInfo>();
  imagesUrls = input.required<string[]>();
  onImageClicked = output<string>();
}
