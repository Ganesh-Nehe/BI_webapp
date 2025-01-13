import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisapprovalDialogTravelService } from './disapproval-dialog-travel.service'

@Component({
  selector: 'app-disapproval-dialog-travel',
  templateUrl: './disapproval-dialog-travel.component.html',
  styleUrls: ['./disapproval-dialog-travel.component.css']
})
export class DisapprovalDialogTravelComponent {
  travelDescription: string = '';

  constructor(
    public dialogRef: MatDialogRef<DisapprovalDialogTravelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private DisapprovalDialogTravelService: DisapprovalDialogTravelService,
    private snackBar: MatSnackBar
  ) {}

  async onSave() {
    const { travelId } = this.data;

    try {
      await this.DisapprovalDialogTravelService.save(travelId, 'Disapproved', this.travelDescription);
      this.dialogRef.close(this.travelDescription);
      this.snackBar.open('Description added successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
    } catch (error) {
      console.error('Error adding description:', error);
      this.snackBar.open('Error adding description', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }
  
  onClose() {
    this.dialogRef.close('reload');
  }
}
