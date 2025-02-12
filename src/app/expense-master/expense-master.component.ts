import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import { ExpenseMasterAddEditComponent } from './expense-master-add-edit/expense-master-add-edit.component'
import { ExpenseMasterService } from './expense-master.service'
import { ExpenseMasterDetailsComponent } from './expense-master-details/expense-master-details.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DisapprovalDialogComponent } from './disapproval-dialog/disapproval-dialog.component'
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component'
import { MasterDescriptionDialogComponent } from './master-description-dialog/master-description-dialog.component';


@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.component.html',
  styleUrls: ['./expense-master.component.css']
})
export class ExpenseMasterComponent {
  displayedColumns: string[] = ['serialNumber', 'EmployeeName', 'ExpenseHead', 'CreateDate', 'TotalAmount', 'viewDetails', "file_location", 'Approval', 'payment'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private expensemasterservice: ExpenseMasterService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getVoucherExpenses();
  }

  async getVoucherExpenses() {
    try {
      const res = await this.expensemasterservice.showAllVoucherExpenses();
      const dataArray = Array.isArray(res.data) ? res.data : [];

      // Reverse the data first
      const reversedData = dataArray.reverse();

      // Define the order for "Approval" statuses
      const approvalOrder: { [key: string]: number } = {
        "Not Selected": 1,
        "Approved": 2,
        "Disapproved": 3,
      };

      // Sort the reversed data based on "Approval"
      const sortedData = reversedData.sort((a: any, b: any) => {
        return (
          (approvalOrder[a.approval as keyof typeof approvalOrder] || 4) -
          (approvalOrder[b.approval as keyof typeof approvalOrder] || 4)
        );
      });

      // Set up the data source
      this.dataSource = new MatTableDataSource(sortedData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      alert('Could not load voucher expenses');
      console.error("Error", err);
    }
  }

  async openDetailsDialog(row: any) {
    try {
      const details = await this.expensemasterservice.getVoucherdetails(row.voucherId);
      this.dialog.open(ExpenseMasterDetailsComponent, {
        data: { voucherDetails: details.data },
        width: '700px',
      });
    } catch (error) {
      console.log('Error getting user details: ', error);
    }
  }

  openDocument(file_location: string) {

    // Replace backslashes with forward slashes if needed (for URL encoding)
    const normalizedLocation = file_location.replace(/\\/g, '/');
    const encodedFileLocation = encodeURIComponent(normalizedLocation);

    this.expensemasterservice.getDocument(encodedFileLocation).subscribe((response: HttpResponse<Blob>) => {
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
      const dialogRef = this.dialog.open(MasterDescriptionDialogComponent, {
        data: {
          voucherId: row.voucherId,
          description: row.description
        },
        width: '500px',
      });
    }
  }

  async onApprovalStatusChange(voucherId: number, approvalStatus: string) {
    if (approvalStatus === 'Not Selected') return;

    if (approvalStatus === 'Disapproved') {
      const dialogRef = this.dialog.open(DisapprovalDialogComponent, {
        disableClose: true,
        width: '600px',
        data: { voucherId }
      });

      dialogRef.afterClosed().subscribe(async (description: string) => {
        console.log(description);
        if (description === 'reload') {
          await this.getVoucherExpenses();
        } else {
          await this.getVoucherExpenses();
        }
      });

      return;// Return early to avoid updating the status without a description
    }

    // Immediate update for statuses other than "Disapproved"
    const body = { voucherId, approvalStatus };
    try {
      const res: any = await this.expensemasterservice.updateApprovalStatus(body);
      if (res.success) {
        this.snackBar.open('Approval status updated successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success'],
        });
        await this.getVoucherExpenses();
      }
    } catch (err) {
      this.snackBar.open('Error updating approval status', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    }
  }

  async openPaymentDialog(voucherPayment: boolean, fileLocation: string, row: any) {
    if (!voucherPayment && row.approval === 'Approved') {
      await this.dialog.open(PaymentDialogComponent, {
        width: '600px',
        data: { voucherId: row.voucherId, empDetails: row}
      }).afterClosed().toPromise();
      await this.getVoucherExpenses();
    } else if (row.approval === 'Disapproved' || row.approval === 'Not Selected') {
      this.snackBar.open('Payment cannot be proceed as expense is not approved yet !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    } else {
      await this.openDocument(fileLocation);
    }
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
