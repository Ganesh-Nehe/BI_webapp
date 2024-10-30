import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentDialogService } from './payment-dialog.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent {
  selectedFile: File = null!;
  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentdialogservice:PaymentDialogService,
    private snackBar: MatSnackBar
  ){}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        this.snackBar.open('Please upload a PDF file.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
        this.selectedFile = null!;
      }
    }
  }

  async onSave() {
    if (!this.selectedFile) {
      this.snackBar.open('No file selected or file is not a PDF.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
      return;
    }
  
    const { voucherId } = this.data;
    const formData = new FormData();
    formData.append('voucherId', voucherId.toString());
    formData.append('file', this.selectedFile);
  
    try {
      const response = await this.paymentdialogservice.save(formData);
      this.dialogRef.close();
      this.snackBar.open('Payment added successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      this.snackBar.open('Error adding Payment', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }
}
