import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import { EmployeeService } from './employee.service';
import { EmployeeAddEditComponent } from './employee-add-edit/employee-add-edit.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = ['serialNumber','userFirstName','userMiddleName','userLastName','telephone_no','mobile_no','emailId','action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private employeeService: EmployeeService) {}

  openAddEditDialog(){
    const dialogRef = this.dialog.open(EmployeeAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next : (val) => {
        if(val){
          this.getEmployeeList();
        }
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(EmployeeAddEditComponent,{
      data,
    })
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      }
    })
    console.log('data send to edit form ', data);
  }

  openDetailsDialog(data: any){
    this.employeeService.getEmployeeDetails(data.userId).subscribe(
      (details) => {
        const dialogRef = this.dialog.open(EmployeeDetailsComponent, {
          data: { employeeDetails: details.data },
          width: '400px',
        });
      },
      (error) => {
        console.log('Error getting user details: ', error);
      }
    );

  }

  ngOnInit(): void {
      this.getEmployeeList();
  }
  getEmployeeList(){
    this.employeeService.getEmployeeList().subscribe({
      next: (res) => {
        // console.log(res);
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
