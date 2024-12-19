import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-travel-head-dialog',
  templateUrl: './add-travel-head-dialog.component.html',
  styleUrls: ['./add-travel-head-dialog.component.css']
})
export class AddTravelHeadDialogComponent {
  travelHeadForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddTravelHeadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.travelHeadForm = this.fb.group({
      travelExpenseCatName: ['', Validators.required],
    });
  }
  
  async addTravelHead() {
    const baseApi = this.apiService.getBaseApi();
    const TravelHeadFormData = this.travelHeadForm.value;

    if (this.travelHeadForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      try {
        const response = await this.http.post(`${baseApi}/API/expense/travelHead/`, TravelHeadFormData, httpOptions).toPromise();
        this.dialogRef.close(true);
        this.snackBar.open('Travel Head added successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      } catch (error) {
        this.snackBar.open('Error adding travel head', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }
  }
}
