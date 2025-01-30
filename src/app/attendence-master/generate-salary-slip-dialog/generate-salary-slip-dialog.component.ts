import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generate-salary-slip-dialog',
  templateUrl: './generate-salary-slip-dialog.component.html',
  styleUrls: ['./generate-salary-slip-dialog.component.css']
})
export class GenerateSalarySlipDialogComponent {
  @ViewChild('dialogContent') dialogContent: any;

  print() {
    const printWindow = window.open('', '', 'height=800,width=1200');
    
    if (printWindow) {
      const content = this.dialogContent.nativeElement.innerHTML;
  
      printWindow.document.write('<html><head><title>Salary Slip</title>');
      printWindow.document.write('<style>'); 
      printWindow.document.write('@page { size: A4; margin: 10mm; }');  // A4 size with 10mm margins
      printWindow.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; }');
      printWindow.document.write('.logo img { width: 330px; height: auto; }'); // Resize logo to fit
      printWindow.document.write('.dialog-content { padding: 0; margin-top: 20px; box-sizing: border-box; }'); // Block layout for content
      printWindow.document.write('.table-format-full { display: block; width: 100%; margin-bottom: 10px; page-break-inside: avoid; }'); // Full width tables
      printWindow.document.write('.table-container { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; }'); // For side-by-side tables
      printWindow.document.write('.table-format, .table-format-2 { width: 48%; margin-bottom: 10px; page-break-inside: avoid; }'); // Side by side tables
      printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
      printWindow.document.write('th, td { padding: 8px; border: 1px solid #000; text-align: left; font-size: 12px; }'); // Adjust font size for print
      printWindow.document.write('th { text-align: center; font-weight: bold; }');
      printWindow.document.write('@media print { body { margin: 0; padding: 0; } }');
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
  
      printWindow.document.close();  // Necessary for IE
      printWindow.print();
    } else {
      console.error('Failed to open print window.');
    }
  }
}
