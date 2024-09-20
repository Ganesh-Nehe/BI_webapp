import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseMasterDetailsService } from './expense-master-details.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-expense-master-details',
  templateUrl: './expense-master-details.component.html',
  styleUrls: ['./expense-master-details.component.css']
})
export class ExpenseMasterDetailsComponent {
  displayedColumns: string[] = ['expenseDate', 'miscExpenseCatName', 'expenseDescription', 'miscExpenseAmount','billLocation'];
  @ViewChild('dialogContent') dialogContent!: ElementRef;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private expensemasterdetailsservice: ExpenseMasterDetailsService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log('VoucherExpenseDetailsComponent initialized with data:', this.data);
  }

  viewBill(billLocation: string) {
    const encodedBillLocation = encodeURIComponent(billLocation);
    this.expensemasterdetailsservice.getDocumentByLocation(encodedBillLocation).subscribe((response: HttpResponse<Blob>) => {
      if (response.body) {
        const blob = new Blob([response.body], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        this.snackBar.open('Response is Null', 'Close', {
          duration: 3000,
          verticalPosition: 'top', 
          horizontalPosition: 'center',
          panelClass: ['snackbar-error'],
        });
      }
    }, error => {
      this.snackBar.open('No file found on server', 'Close', {
        duration: 3000,
        verticalPosition: 'top', 
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    });
  }
  
  print() {
    if (this.dialogContent && this.dialogContent.nativeElement) {
      const printContent = this.dialogContent.nativeElement.innerHTML;
      const printWindow = window.open('', '', 'height=842,width=595');

      if (printWindow) {
        printWindow.document.write('<html><head><title>Voucher Expense Details</title>');
        printWindow.document.write(`
          <style>
            @media print {
              @page { size: A4 portrait; margin: 0; }
              body { margin: 1cm; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: center; }
              th { background-color: #f2f2f2; }
            }
            .logo-container {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo-container img {
              max-width: 100px; /* Adjust the size as needed */
              height: auto;
            }
          </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(`
          <div class="logo-container">
            <img src="assets/CAS logo/Expense logo.jpeg" alt="Company Logo">
          </div>
        `);
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      } else {
        console.error('Failed to open print window');
      }
    } else {
      console.error('Dialog content is not available for printing');
    }
  }
}
