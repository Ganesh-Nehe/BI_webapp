import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddTravelHeadService } from './add-travel-head.service'
import { AddTravelHeadDialogComponent } from './add-travel-head-dialog/add-travel-head-dialog.component'

@Component({
  selector: 'app-add-travel-head',
  templateUrl: './add-travel-head.component.html',
  styleUrls: ['./add-travel-head.component.css']
})
export class AddTravelHeadComponent implements OnInit {
  displayedColumns: string[] = ['sr no', 'Head Name'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private AddTravelHeadService: AddTravelHeadService) { }

  ngOnInit(): void {
    this.getTravelHeadList()
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddTravelHeadDialogComponent);
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
      const res = await this.AddTravelHeadService.getTravelHeadList(); // Await the service call
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
