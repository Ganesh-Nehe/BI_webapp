import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { VoucherExpenseService } from './voucher-expense.service';
import { AddVoucherExpenseComponent } from './add-voucher-expense/add-voucher-expense.component';
import { VoucherExpenseDetailsComponent } from './voucher-expense-details/voucher-expense-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DescriptionDetailDialogComponent } from './description-detail-dialog/description-detail-dialog.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-voucher-expense',
  templateUrl: './voucher-expense.component.html',
  styleUrls: ['./voucher-expense.component.css']
})
export class VoucherExpenseComponent implements OnInit {

  displayedColumns: string[] = ['serialNumber', 'ExpenseHead', 'CreateDate', 'TotalAmount', 'viewDetails', 'file_location','Status', 'payment'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private voucherexpenseservice: VoucherExpenseService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getVoucherExpenses();
  }

  async getVoucherExpenses() {
    try {
      const res = await this.voucherexpenseservice.showAllVoucherExpenses();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      this.snackBar.open('Error loading expense list', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openDocument(file_location: string) {
  
    // Replace backslashes with forward slashes if needed (for URL encoding)
    const normalizedLocation = file_location.replace(/\\/g, '/');
    const encodedFileLocation = encodeURIComponent(normalizedLocation);
  
    this.voucherexpenseservice.getDocument(encodedFileLocation).subscribe((response: HttpResponse<Blob>) => {
      if (response.body) {
        // Create a Blob from the response body and specify the correct MIME type for PDF
        const blob = new Blob([response.body], { type: 'application/pdf' });
  
        // Create a URL for the Blob and open it in a new tab
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

  openDisapproveDetailDialog(row: any) {
    if (row.approval === 'Disapproved') {
      const dialogRef = this.dialog.open(DescriptionDetailDialogComponent, {
        data: {
          voucherId: row.voucherId,
          description: row.description
        },
        width: '500px',
      });
    }
  }

  async openPaymentDocument(voucherPayment: boolean, fileLocation: string, row: any) {
    if (!voucherPayment) {
      this.snackBar.open('Payment is not proceed yet !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    } else {
      this.openDocument(fileLocation);
    }
  }

  async openDetailsDialog(row: any) {
    try {
      const details = await this.voucherexpenseservice.getVoucherdetails(row.voucherId);
      const dialogRef = this.dialog.open(VoucherExpenseDetailsComponent, {
        data: { voucherDetails: details.data },
        width: '700px',
      });
    } catch (error) {
      this.snackBar.open('Error loading expense details', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddVoucherExpenseComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getVoucherExpenses();
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
