import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-estimate-travel-expense-details',
  templateUrl: './estimate-travel-expense-details.component.html',
  styleUrls: ['./estimate-travel-expense-details.component.css']
})
export class EstimateTravelExpenseDetailsComponent implements OnInit {
  displayedColumns: string[] = ['estTravelHead', 'unitCost', 'noOfDays', 'remark','totalExpense'];
  @ViewChild('dialogContent') dialogContent!: ElementRef;
  
  constructor (@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit(): void {
      // console.log("data recieved : ", this.data);
  }
}
