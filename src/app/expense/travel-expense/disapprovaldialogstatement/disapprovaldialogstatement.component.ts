import { Component,Inject  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-disapprovaldialogstatement',
  templateUrl: './disapprovaldialogstatement.component.html',
  styleUrls: ['./disapprovaldialogstatement.component.css']
})
export class DisapprovaldialogstatementComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { travelId: number; travelDescription: string }) {}
}
