import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddVoucherheadDialogService } from './add-voucherhead-dialog.service';

@Component({
  selector: 'app-add-voucherhead-dialog',
  templateUrl: './add-voucherhead-dialog.component.html',
  styleUrls: ['./add-voucherhead-dialog.component.css']
})
export class AddVoucherheadDialogComponent {
  voucherHeadForm : FormGroup;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private addvoucherhead:  AddVoucherheadDialogService,
    private dialogRef: MatDialogRef<AddVoucherheadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public  data: any
    ) {
      this.voucherHeadForm = this.fb.group({
        miscExpenseCatName: ['',Validators.required],
      });
    }

  dialogclose(){
    this.dialogRef.close();
  }

  addVoucherHead(){
    const baseApi = this.apiService.getBaseApi();
    const VoucherHeadFormData = this.voucherHeadForm.value;
  
    if (this.voucherHeadForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };
  
      this.http.post(`${baseApi}/API/expense/voucherhead/`, VoucherHeadFormData, httpOptions)
        .subscribe(
          (response) => {
            console.log('API Response:', response);
            this.dialogRef.close(true);
            // Handle success if needed
          },
          (error) => {
            console.error('API Error:', error);
            // Handle error if needed
          }
        );
    }
}

}
