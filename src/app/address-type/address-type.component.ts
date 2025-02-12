import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddressTypeService } from './address-type.service';
import { AddAddressTypeDialogComponent } from './add-address-type-dialog/add-address-type-dialog.component'

@Component({
  selector: 'app-address-type',
  templateUrl: './address-type.component.html',
  styleUrls: ['./address-type.component.css']
})
export class AddressTypeComponent {
  displayedColumns: string[] = ['sr no', 'addressTypes'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private addressTypeService: AddressTypeService) { }

  ngOnInit(): void {
    this.getTravelHeadList()
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddAddressTypeDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getTravelHeadList(); // Refresh the list after closing the dialog if a new item was added
        }
      }
    });
  }

  async getTravelHeadList() {
    try {
      const res = await this.addressTypeService.getAddressTypeList(); // Await the service call
      console.log(res);
      const dataArray = Array.isArray(res.data) ? res.data : []; // Extract the data
      this.dataSource = new MatTableDataSource(dataArray); // Assign data to the dataSource
      this.dataSource.sort = this.sort; // Set sorting
      this.dataSource.paginator = this.paginator; // Set pagination
    } catch (error) {
      console.error('Error fetching voucher head list:', error); // Handle errors
    }
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset paginator to first page on filter
    }
  }
}
