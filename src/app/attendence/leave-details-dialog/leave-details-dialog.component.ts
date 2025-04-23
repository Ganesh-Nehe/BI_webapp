import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave-details-dialog',
  templateUrl: './leave-details-dialog.component.html',
  styleUrls: ['./leave-details-dialog.component.css']
})
export class LeaveDetailsDialogComponent implements OnInit {

    casualLeaveColumns: string[] = ['totalLeave', 'totalLeaveTaken', 'currentMonthLeave', 'remainingLeave'];
    privilegeLeaveColumns: string[] = ['totalLeave', 'totalLeaveTaken', 'currentMonthLeave', 'remainingLeave'];
    LeaveDetailsColumns: string[] = ['leaveDate' , 'leaveDetail']
    @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LeaveDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  
    // Extract month and year from selectedMonth and selectedYear
    const selectedMonth = this.data.selectedMonth;
    const selectedYear = this.data.selectedYear;
  
    // Filter leaves for the selected month and year
    const filteredLeavesForMonth = this.data.empLeave.data.filter((leave: any) => {
      const leaveDate = new Date(leave.leaveDate);
      const leaveMonth = leaveDate.toLocaleString('default', { month: 'long' }); // Get the month as a string (e.g., "January")
      const leaveYear = leaveDate.getFullYear(); // Get the year as a number
  
      return leaveMonth === selectedMonth && leaveYear === selectedYear; // Filter by both month and year for monthly count
    });
  
    // Count casual and privilege leaves for the selected month
    const casualLeaveCountForMonth = filteredLeavesForMonth.filter((leave: any) => leave.leaveType === 'Casual Leave').length;
    const privilegeLeaveCountForMonth = filteredLeavesForMonth.filter((leave: any) => leave.leaveType === 'Privilege Leave').length;
  
    // Log or use the counts for the selected month
    // console.log('Monthly Casual Leave Count:', casualLeaveCountForMonth);
    // console.log('Monthly Privilege Leave Count:', privilegeLeaveCountForMonth);
  
    // Filter leaves for the selected year (no month filter for yearly count)
    const filteredLeavesForYear = this.data.empLeave.data.filter((leave: any) => {
      const leaveDate = new Date(leave.leaveDate);
      const leaveYear = leaveDate.getFullYear(); // Get the year as a number
      return leaveYear === selectedYear; // Filter only by year for yearly count
    });
  
    // Count casual and privilege leaves for the selected year
    const casualLeaveCountForYear = filteredLeavesForYear.filter((leave: any) => leave.leaveType === 'Casual Leave').length;
    const privilegeLeaveCountForYear = filteredLeavesForYear.filter((leave: any) => leave.leaveType === 'Privilege Leave').length;
  
    // Log or use the counts for the selected year
    // console.log('Yearly Casual Leave Count:', casualLeaveCountForYear);
    // console.log('Yearly Privilege Leave Count:', privilegeLeaveCountForYear);
  
    // You can bind these counts to your table data or any other part of the UI as needed
    this.data.casualLeaveCount = {
      totalCasualLeave: 8, 
      casualLeaveCountForMonth: casualLeaveCountForMonth,
      casualLeaveCountForYear: casualLeaveCountForYear
    };
  
    this.data.privilegeLeaveCount = {
      totalPrivilegeLeave: 16,
      privilegeLeaveCountForMonth: privilegeLeaveCountForMonth,
      privilegeLeaveCountForYear: privilegeLeaveCountForYear
    };

    // console.log('Updated Data:', this.data);
  }

}
