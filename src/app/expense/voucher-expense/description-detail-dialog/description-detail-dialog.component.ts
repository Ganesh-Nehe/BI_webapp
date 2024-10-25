import { Component,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-description-detail-dialog',
  templateUrl: './description-detail-dialog.component.html',
  styleUrls: ['./description-detail-dialog.component.css']
})
export class DescriptionDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { voucherId: number; description: string }) {}
}
