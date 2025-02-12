import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddMaterialDialogService } from './add-material-dialog.service';

@Component({
  selector: 'app-add-material-dialog',
  templateUrl: './add-material-dialog.component.html',
  styleUrls: ['./add-material-dialog.component.css']
})
export class AddMaterialDialogComponent {
  materialForm : FormGroup;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private addMaterialDialogService: AddMaterialDialogService,
    private dialogRef: MatDialogRef<AddMaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public  data: any
    ) {
      this.materialForm = this.fb.group({
        materialDesc: ['',Validators.required],
        HSNcode: [,Validators.required],
        quantity: [,Validators.required],
        unit: ['', Validators.required]
      });
    }

  async addMaterial() {
    const MaterialFormData = this.materialForm.value;

    if (this.materialForm.valid) {
      try {
        const response = await this.addMaterialDialogService.addMaterial(MaterialFormData);
        console.log('API Response:', response);
        this.dialogRef.close(true);
      } catch (error) {
        console.error('API Error:', error);
      }
    }
  }
}
