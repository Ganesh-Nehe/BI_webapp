import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationReturnedDialogService } from './confirmation-returned-dialog.service';

@Component({
  selector: 'app-confirmation-returned-dialog',
  templateUrl: './confirmation-returned-dialog.component.html',
  styleUrls: ['./confirmation-returned-dialog.component.css']
})
export class ConfirmationReturnedDialogComponent implements OnInit {
  Date: Date = new Date();

  constructor(
    private confirmationReturnedDialogService: ConfirmationReturnedDialogService,
    private dialogRef: MatDialogRef<ConfirmationReturnedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }


  async returnedChallan() {
    try {
      const res = await this.confirmationReturnedDialogService.isReturned(this.data.returnValue, this.data.chalanId);
      this.snackBar.open('Chalan Details Addess Successsfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
      this.dialogRef.close(true);
    } catch {
      this.snackBar.open('Error saving returned date', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }
}
