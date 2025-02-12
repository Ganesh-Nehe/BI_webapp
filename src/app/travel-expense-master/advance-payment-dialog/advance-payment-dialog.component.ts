import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdvancePaymentDialogService } from './advance-payment-dialog.service'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
      advanceAmount: [null, [Validators.required, Validators.min(0)]],
      advancePaymentDate: [null, Validators.required]
    });

    this.advancePaymentForm.get('advanceAmount')?.valueChanges.subscribe(value => {
      if (value === 0) {
        this.advancePaymentForm.get('advancePaymentDate')?.setValue(new Date()); // Set today's date
      }
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

  private async generateNoAdvancePDF(): Promise<File> {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();

    // Load a standard font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Define text properties
    const text = "NO ADVANCE AMOUNT PROVIDED";
    const fontSize = 24;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    // Calculate the centered position
    const x = (width - textWidth) / 2;
    const y = (height - textHeight) / 2;

    // Draw the text on the page
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();

    // Convert to a File object
    return new File([pdfBytes], 'NoAdvanceProvided.pdf', { type: 'application/pdf' });
  }

  async onSave(): Promise<void> {
    const advanceAmount = this.advancePaymentForm.get('advanceAmount')?.value;

    let fileToUpload: File | null = this.selectedFile;

    if (advanceAmount === 0) {
      fileToUpload = await this.generateNoAdvancePDF();
    }

    if (!fileToUpload) {
      this.snackBar.open('No file selected or file is not valid.', 'Close', {
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
    formData.append('file', fileToUpload);

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
