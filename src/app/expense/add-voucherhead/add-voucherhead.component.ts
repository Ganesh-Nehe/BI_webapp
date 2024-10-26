import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddVoucherheadService } from './add-voucherhead.service';
import { AddVoucherheadDialogComponent } from './add-voucherhead-dialog/add-voucherhead-dialog.component';

@Component({
  selector: 'app-add-voucherhead',
  templateUrl: './add-voucherhead.component.html',
  styleUrls: ['./add-voucherhead.component.css']
})
export class AddVoucherheadComponent implements OnInit {

  displayedColumns: string[] = ['sr no', 'Head Name'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private voucherheadservice: AddVoucherheadService) {}

  ngOnInit(): void {
    this.getVoucherHeadList(); // Call the method to load data on component initialization
  }

  async getVoucherHeadList() {
    try {
      const res = await this.voucherheadservice.getVoucherHeadList(); // Await the service call
      const dataArray = Array.isArray(res.data) ? res.data : []; // Extract the data
      this.dataSource = new MatTableDataSource(dataArray); // Assign data to the dataSource
      this.dataSource.sort = this.sort; // Set sorting
      this.dataSource.paginator = this.paginator; // Set pagination
    } catch (error) {
      console.error('Error fetching voucher head list:', error); // Handle errors
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddVoucherheadDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getVoucherHeadList(); // Refresh the list after closing the dialog if a new item was added
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset paginator to first page on filter
    }
  }
}
