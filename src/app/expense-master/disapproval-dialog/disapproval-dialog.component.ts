import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DisapprovalDialogService } from './disapproval-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-disapproval-dialog',
  templateUrl: './disapproval-dialog.component.html',
  styleUrls: ['./disapproval-dialog.component.css']
})
export class DisapprovalDialogComponent {
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<DisapprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private disapprovalDialogService: DisapprovalDialogService,
    private snackBar: MatSnackBar
  ) {}

  async onSave() {
    const { voucherId } = this.data;

    try {
      const response = await this.disapprovalDialogService.save(voucherId, 'Disapproved', this.description);
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
}
