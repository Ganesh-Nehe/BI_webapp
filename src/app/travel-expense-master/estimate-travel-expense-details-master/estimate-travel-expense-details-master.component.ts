import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-estimate-travel-expense-details-master',
  templateUrl: './estimate-travel-expense-details-master.component.html',
  styleUrls: ['./estimate-travel-expense-details-master.component.css']
})
export class EstimateTravelExpenseDetailsMasterComponent implements OnInit {
  displayedColumns: string[] = ['estTravelHead', 'unitCost', 'noOfDays', 'remark', 'totalExpense'];
  @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // console.log("data recieved : ", this.data);
  }
}
