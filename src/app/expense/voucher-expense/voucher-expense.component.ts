import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VoucherExpenseService } from './voucher-expense.service';
import { AddVoucherExpenseComponent } from './add-voucher-expense/add-voucher-expense.component';
import { VoucherExpenseDetailsComponent } from  './voucher-expense-details/voucher-expense-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-voucher-expense',
  templateUrl: './voucher-expense.component.html',
  styleUrls: ['./voucher-expense.component.css']
})
export class VoucherExpenseComponent implements OnInit {

  displayedColumns: string[] = ['voucherId', 'ExpenseHead' ,'CreateDate', 'TotalAmount', 'viewDetails', 'Status'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private voucherexpenseservice: VoucherExpenseService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getVoucherExpenses();
  }

  getVoucherExpenses() {
    this.voucherexpenseservice.showAllVoucherExpenses().subscribe({
      next: (res) =>  {
        console.log(res);
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator
      },
      error: (err) => {
        this.snackBar.open('Error loading expense list', 'Close', {
          duration: 3000,
          verticalPosition: 'top', 
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  openDetailsDialog(row: any) {
    this.voucherexpenseservice.getVoucherdetails(row.voucherId).subscribe(
      (details)=>{
        const dialogRef = this.dialog.open(VoucherExpenseDetailsComponent, {
          data: {voucherDetails: details.data},
          width: '700px',
        });
      },
      (error)=>{
        this.snackBar.open('Error loading expaense datails', 'Close', {
          duration: 3000,
          verticalPosition: 'top', 
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    );
  }

  openAddDialog(){
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
