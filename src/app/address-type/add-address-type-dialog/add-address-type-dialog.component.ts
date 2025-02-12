import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddAddressTypeDialogService } from './add-address-type-dialog.service';

@Component({
  selector: 'app-add-address-type-dialog',
  templateUrl: './add-address-type-dialog.component.html',
  styleUrls: ['./add-address-type-dialog.component.css']
})
export class AddAddressTypeDialogComponent {
  AddressTypeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private snackBar: MatSnackBar,
    private AddAddressTypeDialogService:AddAddressTypeDialogService,
    private dialogRef: MatDialogRef<AddAddressTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddressTypeForm = this.fb.group({
      addressType: ['', Validators.required],
    });
  }
  
  async addAddressType() {
    const baseApi = this.apiService.getBaseApi();
    const AddressTypeFormData = this.AddressTypeForm.value;

    if (this.AddressTypeForm.valid) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
        })
      };

      try {
        const response = await this.AddAddressTypeDialogService.addAddressType(AddressTypeFormData);
        this.dialogRef.close(true);
        this.snackBar.open('Address type added successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
      } catch (error) {
        this.snackBar.open('Error adding address type', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }
  }
}
