import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-view-chalan-dialog',
  templateUrl: './view-chalan-dialog.component.html',
  styleUrls: ['./view-chalan-dialog.component.css']
})
export class ViewChalanDialogComponent {
  customerDetailsColumns: string[] = ['customerDetails', 'deliveryAddress'];
  displayedColumns: string[] = ['itemCode', 'itemDesc','SAC_HSNcode','quantity'];
  customerLogoUrl: string | undefined;
  @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: APIService, private http: HttpClient) { }

  ngOnInit(): void {
    console.log("data recieved : ", this.data);
  }
}
