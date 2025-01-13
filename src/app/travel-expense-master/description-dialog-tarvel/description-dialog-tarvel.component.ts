import { Component,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-description-dialog-tarvel',
  templateUrl: './description-dialog-tarvel.component.html',
  styleUrls: ['./description-dialog-tarvel.component.css']
})
export class DescriptionDialogTarvelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { travelId: number; travelDescription: string }) {}
}
