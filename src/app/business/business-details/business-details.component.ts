import { Component, OnInit,Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.css']
})
export class BusinessDetailsComponent implements OnInit {

  businessDetails : any;

  customerDetailsColumns: string[] = ['businessName', 'CIN_no', 'PAN_no', 'address'];
  @ViewChild('dialogContent') dialogContent!: ElementRef;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void{
    this.businessDetails = this.data.details.data;
    console.log("data recieved : ",this.data.details.data);
  }
}

