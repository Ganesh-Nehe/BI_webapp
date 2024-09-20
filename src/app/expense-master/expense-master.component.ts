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

@Component({
  selector: 'app-expense-master',
  templateUrl: './expense-master.component.html',
  styleUrls: ['./expense-master.component.css']
})
export class ExpenseMasterComponent {
  displayedColumns: string[] = ['voucherId', 'ExpenseHead' ,'CreateDate', 'TotalAmount', 'viewDetails', 'Approval'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private expensemasterservice: ExpenseMasterService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getVoucherExpenses();
  }

  getVoucherExpenses() {
    this.expensemasterservice.showAllVoucherExpenses().subscribe({
      next: (res) =>  {
        // console.log(res);
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      },
      error: (err) => {
        alert('Could not load voucher  expenses');
        console.log("Error", err);
      }
    });
  }

  openDetailsDialog(row: any) {
    this.expensemasterservice.getVoucherdetails(row.voucherId).subscribe(
      (details)=>{
        const dialogRef = this.dialog.open(ExpenseMasterDetailsComponent, {
          data: {voucherDetails: details.data},
          width: '700px',
        });
      },
      (error)=>{
        console.log('error getting user details: ', error);
      }
    );
  }

  onApprovalStatusChange(voucherId: number, approvalStatus: string) {
    if (approvalStatus === 'Not Selected') return;

    const body = { voucherId, approvalStatus };

    this.expensemasterservice.updateApprovalStatus(body).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackBar.open('Approval status updated successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',  
            horizontalPosition: 'center', 
            panelClass: ['snackbar-success'],
          });
          this.getVoucherExpenses();
        }
      },
      error: (err) => {
        this.snackBar.open('Error updating approval status', 'Close', {
          duration: 3000,
          verticalPosition: 'top', 
          horizontalPosition: 'center',
          panelClass: ['snackbar-error'],
        });
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
