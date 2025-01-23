import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-leave',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.css']
})
export class AddLeaveComponent {
  leaveDetailsForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddLeaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leaveDetailsForm = this.fb.group({
      leaveDate: [,Validators.required],
      leaveDetails: ['', Validators.required],
    });
  }

  async addLeaveDetails() {
    const baseApi = this.apiService.getBaseApi();
    const leaveDetails = this.leaveDetailsForm.value;
    const businessId = localStorage.getItem('businessId');

    if (this.leaveDetailsForm.valid) {
      const leaveDate = new Date(leaveDetails.leaveDate); // Ensure leaveDate is a Date object
      const offset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
      const istDate = new Date(leaveDate.getTime() + offset);
      leaveDetails.leaveDate = istDate.toISOString();
      leaveDetails.businessId = businessId;
      //console.log(leaveDetails);
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      try {
        const response = await this.http.post(`${baseApi}/API/addcompanyleave/`, leaveDetails, httpOptions).toPromise();
        this.dialogRef.close(true);
        this.snackBar.open('Company leave added successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      } catch (error) {
        this.snackBar.open('Error adding Company leave', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }
  }
}
