import { Component,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-disapprovaldialogesttravel',
  templateUrl: './disapprovaldialogesttravel.component.html',
  styleUrls: ['./disapprovaldialogesttravel.component.css']
})
export class DisapprovaldialogesttravelComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { EstTravelHeadId: number; description: string }) {}
}
