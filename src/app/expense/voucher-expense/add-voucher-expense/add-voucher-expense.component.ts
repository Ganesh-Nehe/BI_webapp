import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-voucher-expense',
  templateUrl: './add-voucher-expense.component.html',
  styleUrls: ['./add-voucher-expense.component.css']
})
export class AddVoucherExpenseComponent implements OnInit {

  voucherExpenseData: FormGroup;
  voucherHeads: any[] = [];
  currencies: any[] = [];
  totalExpenseAmount: number = 0; 
  fileData: (File | null)[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private dialogref: MatDialogRef<AddVoucherExpenseComponent>
  ) {
    this.voucherExpenseData = this.fb.group({
      mischeadname: ['', Validators.required],
      expenses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadVoucherHeads();
    this.loadCurrencies(); 
    this.addExpense(); // Initialize with one expense form group
  }

  get expenses(): FormArray {
    return this.voucherExpenseData.get('expenses') as FormArray;
  }

  createExpenseGroup(): FormGroup {
    return this.fb.group({
      miscExpenseCatId: ['', Validators.required],
      expenseDate: ['', Validators.required],
      miscExpenseAmount: ['', Validators.required],
      currencyId: ['', Validators.required],
      expenseDescription: ['', Validators.required],
      hasBill: [false],
      billStatus: ['No bill'],
      billLocation: ['']
    });
  }

  addExpense(): void {
    this.expenses.push(this.createExpenseGroup());
    this.fileData.push(null);
  }

  removeExpense(index: number): void {
    this.expenses.removeAt(index);
    this.fileData.splice(index, 1);
    this.calculateTotalExpenseAmount();
  }

  dialogclose() {
    this.dialogref.close(true);
  }

  onFileChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = (input.files as FileList)[0];
    this.fileData[index] = file;
  }

  toggleFileUpload(index: number): void {
    const expense = this.expenses.at(index);
    if (expense.get('hasBill')?.value) {
      expense.patchValue({ billStatus: 'Bill' });  
    } else {
      expense.patchValue({ billStatus: 'No bill' }); 
      this.fileData[index] = null;
    }
  }
  
  calculateTotalExpenseAmount(): void {
    this.totalExpenseAmount = this.expenses.controls.reduce((sum, control) => {
      const amount = control.get('miscExpenseAmount')?.value;
      return sum + (amount ? parseFloat(amount) : 0);
    }, 0);
  }

  async loadVoucherHeads(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    try {
      const response: any = await this.http.get(`${baseApi}/API/expense/voucherhead`, httpOptions).toPromise();
      this.voucherHeads = response.data;
    } catch (error) { 
      console.error('Error fetching voucher heads:', error);
    }
  }

  async loadCurrencies(): Promise<void> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response: any = await this.http.get(`${baseApi}/API/currency`, httpOptions).toPromise();
      this.currencies = response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  }

  async addVoucherexpense(): Promise<void> {
    this.calculateTotalExpenseAmount();
    const userId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const baseApi = this.apiService.getBaseApi();
    const formData = new FormData();

    formData.append('mischeadname', this.voucherExpenseData.value.mischeadname);
    formData.append('employeeId', userId ?? ''); 
    formData.append('businessId', businessId ?? '');

    this.voucherExpenseData.value.expenses.forEach((expense: any, index: number) => {
      Object.keys(expense).forEach(key => {
        formData.append(`expenses[${index}][${key}]`, expense[key]);
      });
      if (this.fileData[index]) {
        formData.append(`file${index}`, this.fileData[index] || '');
      }
    });

    formData.append('totalAmount', this.totalExpenseAmount.toString());

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/expense/voucher/`, formData, httpOptions).toPromise();
      console.log('API Response:', response);
      this.dialogref.close(true);
    } catch (error) {
      console.error('API Error:', error);
    }
  }
}
