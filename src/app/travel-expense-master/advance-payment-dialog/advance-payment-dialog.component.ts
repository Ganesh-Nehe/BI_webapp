import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdvancePaymentDialogService } from './advance-payment-dialog.service'

@Component({
  selector: 'app-advance-payment-dialog',
  templateUrl: './advance-payment-dialog.component.html',
  styleUrls: ['./advance-payment-dialog.component.css']
})
export class AdvancePaymentDialogComponent {
  selectedFile: File = null!;
  advancePaymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AdvancePaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private advancePaymentDialogService: AdvancePaymentDialogService,
    private snackBar: MatSnackBar
  ) {
    this.advancePaymentForm = this.formBuilder.group({
      advanceAmount: [null, [Validators.required, Validators.min(1)]],
      advancePaymentDate: [null, Validators.required]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;
      } else {
        this.snackBar.open('Please upload a PDF, PNG, JPG, or JPEG file.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
        this.selectedFile = null!;
      }
    }
  }

  async onSave(): Promise<void> {
    if (!this.selectedFile) {
      this.snackBar.open('No file selected or file is not a PDF, PNG, JPG, or JPEG file.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
      return;
    }

    const { EstTravelHeadId } = this.data;
    const formData = new FormData();
    formData.append('EstTravelHeadId', EstTravelHeadId.toString());
    formData.append('advanceAmount', this.advancePaymentForm.get('advanceAmount')?.value);
    formData.append('advancePaymentDate', this.advancePaymentForm.get('advancePaymentDate')?.value);
    formData.append('file', this.selectedFile);

    try {
      await this.advancePaymentDialogService.save(formData);
      this.dialogRef.close();
      this.snackBar.open('Advance payment added successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
    } catch (error) {
      console.error('Error adding advance payment:', error);
      this.snackBar.open('Error adding advance payment', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }
}
