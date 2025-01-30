import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { AttendenceMasterService } from './attendence-master.service'
import { AttendanceMasterEmployeeLeaveDetailsDialogComponent } from './attendance-master-employee-leave-details-dialog/attendance-master-employee-leave-details-dialog.component';
import { GenerateSalarySlipDialogComponent } from './generate-salary-slip-dialog/generate-salary-slip-dialog.component'
@Component({
  selector: 'app-attendence-master',
  templateUrl: './attendence-master.component.html',
  styleUrls: ['./attendence-master.component.css']
})
export class AttendenceMasterComponent implements OnInit {

  displayedColumns: string[] = ['serialNumber', 'employeeId', 'employeeName', 'leaveDetails', 'salarySlip'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
  ];
  years: number[] = [];
  selectMonth = new FormControl(new Date().getMonth());
  selectYear = new FormControl(new Date().getFullYear());

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private AttendenceMasterService: AttendenceMasterService) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      this.years.push(i);
    }

    this.getEmployeeAttendence();
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  onMonthYearChange(): void {
  }

  async getEmployeeAttendence() {
    try {
      const res = await this.AttendenceMasterService.getEmployeeAttendance();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error fetching voucher head list:', error);
    }
  }

  async employeeLeaveDetails(employeeId: number) {
    const selectedMonthIndex = this.selectMonth.value;
    if (selectedMonthIndex !== null && selectedMonthIndex !== undefined) {
      const selectedMonth = this.months[selectedMonthIndex];
      const selectedYear = this.selectYear.value;
      const empLeave = await this.AttendenceMasterService.getEmployeeLeave(employeeId);
      const dialogRef = this.dialog.open(AttendanceMasterEmployeeLeaveDetailsDialogComponent, {
        data: { selectedMonth,selectedYear,empLeave },
        width: '900px'
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            // this.updateDates();
          }
        }
      });
    }
  }

  async generateSalarySlip(row: any){
    const employeeId = row.employeeId;
    const selectedMonthIndex = this.selectMonth.value;
    if (selectedMonthIndex !== null && selectedMonthIndex !== undefined) {
      const selectedMonth = this.months[selectedMonthIndex];
      const selectedYear = this.selectYear.value;
      const empLeave = await this.AttendenceMasterService.getEmployeeLeave(employeeId);
      const dialogRef = this.dialog.open(GenerateSalarySlipDialogComponent, {
        data: { selectedMonth,selectedYear,empLeave },
        width: '60rem'
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            // this.updateDates();
          }
        }
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
