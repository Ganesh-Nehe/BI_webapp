import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveMasterService } from './leave-master.service';
import { AddLeaveComponent } from './add-leave/add-leave.component';

@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.css']
})
export class LeaveMasterComponent {
  displayedColumns: string[] = ['sr no', 'leavedate', 'leaveDetails'];
  dataSource!: MatTableDataSource<any>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private LeaveMasterService: LeaveMasterService) { }

  ngOnInit(): void {
    this.getLeaveList()
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddLeaveComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getLeaveList(); // Refresh the list after closing the dialog if a new item was added
        }
      }
    });
  }

  async getLeaveList() {
    try {
      const res = await this.LeaveMasterService.getLeaveList(); // Await the service call
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
