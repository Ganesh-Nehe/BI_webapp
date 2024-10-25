import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-disapproval-dialog',
  templateUrl: './disapproval-dialog.component.html',
  styleUrls: ['./disapproval-dialog.component.css']
})
export class DisapprovalDialogComponent {
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<DisapprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave(): void {
    console.log('Description:', this.description);
    this.dialogRef.close();
  }
}
