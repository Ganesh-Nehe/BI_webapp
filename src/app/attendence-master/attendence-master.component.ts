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

  displayedColumns: string[] = ['serialNumber', 'employeeId', 'employeeName', 'privilegeLeave', 'casualLeave', 'totalLeaveTaken', 'totalLeaveRemaining', 'salarySlip'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'
  ];
  years: number[] = [];
  selectMonth = new FormControl(new Date().getMonth() - 1);
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
    this.getEmployeeAttendence()
  }

  async getEmployeeAttendence() {
    
    if (this.selectMonth.value !== null && this.selectMonth.value !== undefined) {
      const selectedMonth = this.selectMonth.value;
      const selectedYear: any = this.selectYear.value;

      const monthfirstDayUTC = new Date(Date.UTC(selectedYear, selectedMonth, 1))
      const monthfirstDayIST = new Date(monthfirstDayUTC.getTime() - (5.5 * 60 * 60 * 1000));  
      const monthfirstDay = monthfirstDayIST.toISOString();
      const monthlastDay = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0, 0, 0, 0)).toISOString();

      const yearfirstDayUTC = new Date(Date.UTC(selectedYear, 0, 1, 0, 0, 0));  
      const yearfirstDayIST = new Date(yearfirstDayUTC.getTime() - (5.5 * 60 * 60 * 1000));  
      const yearfirstDay = yearfirstDayIST.toISOString();  

      const yearlastDay = new Date(Date.UTC(selectedYear + 1, 0, 0, 0, 0, 0)).toISOString();  
      
      console.log(yearfirstDay);
      console.log(yearlastDay);

      try {
        const res = await this.AttendenceMasterService.getEmployeeAttendanceLeave(monthfirstDay,monthlastDay,yearfirstDay,yearlastDay);
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } catch (error) {
        console.error('Error fetching voucher head list:', error);
      }
    }
  }

  async generateSalarySlip(row: any) {
    const employeeId = row.employeeId;
    const selectedMonthIndex = this.selectMonth.value;
    if (selectedMonthIndex !== null && selectedMonthIndex !== undefined) {
      const selectedMonth = this.months[selectedMonthIndex];
      const selectedYear = this.selectYear.value;
      const dialogRef = this.dialog.open(GenerateSalarySlipDialogComponent, {
        data: { selectedMonth, selectedYear },
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
}
