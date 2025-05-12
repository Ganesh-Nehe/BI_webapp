
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-details-dialog',
  templateUrl: './customer-details-dialog.component.html',
  styleUrls: ['./customer-details-dialog.component.css']
})
export class CustomerDetailsDialogComponent implements OnInit {
  customerDetailsColumns: string[] = ['customerName', 'contactPerson', 'contactPersonNo', 'gstNo'];
  displayedColumns: string[] = ['branch', 'address'];
  customerLogoUrl: string | undefined;
  @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log("data recieved : ", this.data);
  }
}
