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

@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.component.html',
  styleUrls: ['./expense-master.component.css']
})
export class ExpenseMasterComponent {
  displayedColumns: string[] = ['voucherId', 'ExpenseHead' ,'CreateDate', 'TotalAmount', 'viewDetails', "file_location", 'Approval'];

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
      this.dataSource = new MatTableDataSource(dataArray);
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
    console.log(file_location);
  
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

  async onApprovalStatusChange(voucherId: number, approvalStatus: string) {
    if (approvalStatus === 'Not Selected') return;

    if (approvalStatus === 'Disapproved') {
      const dialogRef = this.dialog.open(DisapprovalDialogComponent, {
        disableClose: true,
        width: '600px',
        data: { voucherId }
      });

      dialogRef.afterClosed().subscribe(async (description: string) => {
        if (description) {
          const body = { voucherId, approvalStatus: 'Disapproved', description };

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
      });

      return; // Return early to avoid updating the status without a description
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
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
