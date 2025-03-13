import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmLeaveDialogService } from './confirm-leave-dialog.service';

@Component({
  selector: 'app-confirm-leave-dialog',
  templateUrl: './confirm-leave-dialog.component.html',
  styleUrls: ['./confirm-leave-dialog.component.css']
})
export class ConfirmLeaveDialogComponent implements OnInit  {
  constructor(
    private confirmLeaveDialogService: ConfirmLeaveDialogService,
    private dialogRef: MatDialogRef<ConfirmLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  async dialogClose(){
    await this.dialogRef.close(true);
  }
  async confirmLeave(){
    try {
      const res = await this.confirmLeaveDialogService.addLeave(this.data.parsedDate, this.data.leaveType);
      this.snackBar.open('Chalan Details Addess Successsfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
      this.dialogRef.close(true);
    }catch{
      this.snackBar.open('Error saving returned date', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }
}
