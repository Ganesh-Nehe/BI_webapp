import { Component,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-master-description-dialog',
  templateUrl: './master-description-dialog.component.html',
  styleUrls: ['./master-description-dialog.component.css']
})
export class MasterDescriptionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { voucherId: number; description: string }) {}
}
