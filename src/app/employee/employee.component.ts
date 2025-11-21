import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from './employee.service';
import { EmployeeAddEditComponent } from './employee-add-edit/employee-add-edit.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = ['serialNumber', 'employeeFirstName', 'mobile_no', 'emailId', 'view', 'edit', 'toggle'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private employeeService: EmployeeService) {}

  async ngOnInit(): Promise<void> {
    await this.getEmployeeList();
  }

  async getEmployeeList(): Promise<void> {
    try {
      const res = await this.employeeService.getEmployeeList();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);
      dataArray.forEach((item: any) => {
        item.isActive = item.live_sleep === 1;
      });
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      console.error('Error fetching employee list:', err);
    }
  }

  openAddEditDialog(): void {
    const dialogRef = this.dialog.open(EmployeeAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      }
    });
  }

  openEditForm(data: any): void {
    const dialogRef = this.dialog.open(EmployeeAddEditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      }
    });
    console.log('Data sent to edit form:', data);
  }

  async openDetailsDialog(data: any): Promise<void> {
    try {
      const details = await this.employeeService.getEmployeeDetails(data.employeeId);
      const dialogRef = this.dialog.open(EmployeeDetailsComponent, {
        data: { employeeDetails: details.data }
      });
    } catch (error) {
      console.log('Error getting user details:', error);
    }
  }

  async toggleEmployee(row: any) {
    row.isActive = !row.isActive;
    const live_sleepValue = row.isActive ? 1 : 0;

    try {
      await this.employeeService.updateEmployeeStatus(row.employeeId, live_sleepValue);
    } catch (error) {
      console.error('Error updating Employee status:', error);
      row.isActive = !row.isActive;
    }
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
