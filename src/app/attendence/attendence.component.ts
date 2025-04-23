import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PunchTimeDialogComponent } from './punch-time-dialog/punch-time-dialog.component';
import { LeaveDetailsDialogComponent } from './leave-details-dialog/leave-details-dialog.component';
import { AttendenceService } from './attendence.service';
import { ConfirmLeaveDialogComponent } from './confirm-leave-dialog/confirm-leave-dialog.component';
// Define the interface for attendance data
interface Attendance {
  attendenceId: number;
  punchIn: string | null;
  punchOut: string | null;
}

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent implements OnInit {

  displayedColumns: string[] = ['sr no', 'date', 'day', 'punchIn', 'punchOut', 'leave'];
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
  companyLeaveData: any[] = [];

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private attendenceService: AttendenceService) { }

  ngOnInit(): void {
    // Populate years dynamically (e.g., last 10 years + next 1 year)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      this.years.push(i);
    }

    // Initial data population
    this.updateDates();
  }

  onMonthYearChange(): void {
    this.updateDates();
  }

  async updateDates(): Promise<void> {
    const res = await this.attendenceService.getCompanyLeave();
    const att = await this.attendenceService.getAttendence();
    const empLeave = await this.attendenceService.getEmployeeLeave();
    this.companyLeaveData = res.data;

    const selectedMonth = this.selectMonth.value;
    const selectedYear = this.selectYear.value;

    if (selectedMonth !== null && selectedYear !== null) {
      const dates = this.getDatesInMonth(selectedMonth, selectedYear);

      // Map attendance records by their punchIn date
      const attendanceMap = new Map<string, Attendance>(
        att.data.map((item: Attendance) => [
          item.punchIn
            ? new Date(item.punchIn).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
            : '',
          item,
        ])
      );

      // Map employee leave records by their leaveDate
      const employeeLeaveMap = new Map<string, any>(
        empLeave.data.map((leave: any) => [
          new Date(leave.leaveDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          leave,
        ])
      );

      // Map company leave details by date
      const companyLeaveMap = new Map<string, string>(
        this.companyLeaveData.map((leave: any) => [
          new Date(leave.leaveDates).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          leave.leaveDetails, // Store leave details for each company leave date
        ])
      );

      const mergedData = dates.map((date) => {
        const attendance = attendanceMap.get(date.date);
        const employeeLeave = employeeLeaveMap.get(date.date);
        const companyLeaveDetails = companyLeaveMap.get(date.date);
        return {
          ...date,
          punchIn: attendance?.punchIn || null,
          punchOut: attendance?.punchOut || null,
          attendenceId: attendance?.attendenceId || null,
          leaveChecked: employeeLeave ? true : false,
          leaveType: employeeLeave?.leaveType || null,
          leaveDetails: companyLeaveDetails || null,
        };
      });

      const newDataSource = new MatTableDataSource(mergedData);
      newDataSource.paginator = this.paginator;
      newDataSource.sort = this.sort;

      this.dataSource = newDataSource;
    }
  }

  getDatesInMonth(month: number, year: number): any[] {
    const date = new Date(year, month, 1);
    const result = [];

    // Convert company leave dates into Date objects for comparison
    const companyLeaveDates = this.companyLeaveData.map(leave => new Date(leave.leaveDates).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }));

    while (date.getMonth() === month) {
      const formattedDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

      result.push({
        day: date.toLocaleString('en-US', { weekday: 'long' }),
        date: formattedDate,
        punchIn: '',
        punchOut: '',
        leaveChecked: false,
        leaveType: null,
        isCompanyLeave: companyLeaveDates.includes(formattedDate) // Flag to mark company leave dates
      });

      date.setDate(date.getDate() + 1);
    }

    return result;
  }

  onLeaveCheckboxChange(row: any): void {
    if (!row.leaveChecked) {
      row.leaveType = null; // Reset leave type when unchecked
    }
  }

  isToday(dateString: string): boolean {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isWithinAllowedRange(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
  
    // Get first and last day of the current and previous months
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
  
    // Check if today's date is past the 5th
    const isPast5th = today.getDate() > 20;
  
    if (isPast5th) {
      // After 5th, only allow current month till today
      return date >= firstDayOfCurrentMonth && date <= today;
    } else {
      // Before 5th, allow previous month and current month till today
      return (date >= firstDayOfPreviousMonth && date <= lastDayOfPreviousMonth) || (date >= firstDayOfCurrentMonth && date <= today);
    }
  }

  isTodayOrLater(dateString: string): boolean {
    const today = new Date();
    const date = new Date(dateString);

    // Check if the date is today or in the future
    return (
      date.getFullYear() > today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() && date.getMonth() >= today.getMonth())
    );
  }

  isSunday(dateString: string): boolean {
    const date = new Date(dateString);
    return date.getDay() === 0; // 0 corresponds to Sunday
  }

  async onLeaveDetailClick(): Promise<void> {
    const selectedMonthIndex = this.selectMonth.value;
    if (selectedMonthIndex !== null && selectedMonthIndex !== undefined) {
      const selectedMonth = this.months[selectedMonthIndex];
      const selectedYear = this.selectYear.value;
      const empLeave = await this.attendenceService.getEmployeeLeave();
      const dialogRef = this.dialog.open(LeaveDetailsDialogComponent, {
        data: { selectedMonth, selectedYear, empLeave },
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            //this.loadtravelEstimate();
          }
        }
      });

    } else {
      alert('Please select a valid month and year.');
    }
  }

  punchTime(row: any, text: any) {
    //const res = await this.TravelExpenseMasterService.getEstTravelExpenseDetails(row);
    //console.log(row);
    //console.log(text);
    if (text === 'punchOut') {
      if (row.punchIn === '' || row.punchIn === null) {
        this.snackBar.open('Please Punch In First !', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      } else {
        const date = row.date;
        const attendenceId = row.attendenceId;
        console.log(attendenceId);
        const dialogRef = this.dialog.open(PunchTimeDialogComponent, {
          data: { date, text, attendenceId },
          // width: '400px'
        });
        dialogRef.afterClosed().subscribe({
          next: (val) => {
            if (val) {
              this.updateDates();
            }
          }
        });
      }
    } else {
      const date = row.date;
      const dialogRef = this.dialog.open(PunchTimeDialogComponent, {
        data: { date, text },
        // width: '400px'
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.updateDates();
          }
        }
      });
    }
  }

  async onLeaveSelect(row: any) {
    const dateISO = row.date;
    const parsedDate = new Date(dateISO);
    const leaveType = row.leaveType;

      const dialogRef = this.dialog.open(ConfirmLeaveDialogComponent, {
        data: { parsedDate, leaveType },        
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.updateDates();
          }
        }
      });
  }

  getSerialNumber(index: number): number {
    if (!this.paginator) {
      return index + 1; // Fallback if paginator is not initialized
    }
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }
}
