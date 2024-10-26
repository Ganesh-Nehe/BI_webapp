import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddCurrencyService } from './add-currency.service'
@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.css']
})
export class AddCurrencyComponent {
  currencyForm : FormGroup;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private addcurrencyservice:  AddCurrencyService,
    private dialogRef: MatDialogRef<AddCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public  data: any
    ) {
      this.currencyForm = this.fb.group({
        currency_name: ['',Validators.required],
      });
    }

  dialogclose(){
    this.dialogRef.close();
  }

  async addCurrency() {
    const baseApi = this.apiService.getBaseApi();
    const CurrencyFormData = this.currencyForm.value;

    if (this.currencyForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      try {
        const response = await this.http.post(`${baseApi}/API/currency/`, CurrencyFormData, httpOptions).toPromise();
        console.log('API Response:', response);
        this.dialogRef.close(true);
      } catch (error) {
        console.error('API Error:', error);
      }
    }
  }
}
