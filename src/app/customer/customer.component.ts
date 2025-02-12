import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from './customer.service';
import { AddCustomerDialogComponent } from './add-customer-dialog/add-customer-dialog.component';
import { CustomerDetailsDialogComponent } from './customer-details-dialog/customer-details-dialog.component'
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {


  displayedColumns: string[] = ['serialNumber', 'customerName', 'contactPerson', 'contactPersonNo', 'gstNo', 'viewDetails', 'edit'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomerList()
  }

  async loadCustomerList() {
    try {
      const res = await this.customerService.loadCustomerList();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      this.snackBar.open('Error loading customer list', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {disableClose: true});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadCustomerList();
        }
      }
    });
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  async openCustomerDetailsDialog(row: any) {
    const res = await this.customerService.getCutomerDetailsById(row.customerId);
    const dialogRef = this.dialog.open(CustomerDetailsDialogComponent, {
      data: { res, row},
      width: '900px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadCustomerList();
        }
      }
    });
  }

  async openEditDialog(row: any) {
    const res = await this.customerService.getCutomerDetailsById(row.customerId);
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      disableClose: true,
      width: '900px',
      data: { res, row}
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadCustomerList();
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
