import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisaprrovaldialogesttravelService } from './disaprrovaldialogesttravel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-disaprroval-dialog-est-travel',
  templateUrl: './disaprroval-dialog-est-travel.component.html',
  styleUrls: ['./disaprroval-dialog-est-travel.component.css']
})
export class DisaprrovalDialogEstTravelComponent {
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<DisaprrovalDialogEstTravelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private DisaprrovaldialogesttravelService: DisaprrovaldialogesttravelService,
    private snackBar: MatSnackBar
  ) {}

  async onSave() {
    const { EstTravelHeadId } = this.data;

    try {
      await this.DisaprrovaldialogesttravelService.save(EstTravelHeadId, 'Disapproved', this.description);
      this.dialogRef.close(this.description);
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
