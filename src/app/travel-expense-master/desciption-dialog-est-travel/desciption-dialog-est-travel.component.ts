import { Component,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-desciption-dialog-est-travel',
  templateUrl: './desciption-dialog-est-travel.component.html',
  styleUrls: ['./desciption-dialog-est-travel.component.css']
})
export class DesciptionDialogEstTravelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { EstTravelHeadId: number; description: string }) {}
}
