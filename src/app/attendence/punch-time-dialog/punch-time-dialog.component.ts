import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIService } from 'src/app/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PunchTimeDialogService } from './punch-time-dialog.service'

@Component({
  selector: 'app-punch-time-dialog',
  templateUrl: './punch-time-dialog.component.html',
  styleUrls: ['./punch-time-dialog.component.css']
})
export class PunchTimeDialogComponent implements OnInit {
  punchTimeform: FormGroup;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: APIService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PunchTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private punchTimeDialogService: PunchTimeDialogService
  ) {
    this.punchTimeform = this.fb.group({
      hour: [0,[Validators.required, Validators.min(0), Validators.max(23)],
      ],
      minute: [0,[Validators.required, Validators.min(0), Validators.max(59)],
      ],
    });
  }

  ngOnInit(): void {
      //console.log(this.data);
      //console.log(this.data.date);

      const currentDate = new Date();
      const providedDate = new Date(this.data.date); 
      const isToday =
      currentDate.getFullYear() === providedDate.getFullYear() &&
      currentDate.getMonth() === providedDate.getMonth() &&
      currentDate.getDate() === providedDate.getDate();
      if (isToday) {
        this.punchTimeform.patchValue({ 
          hour: currentDate.getHours(), 
          minute: currentDate.getMinutes() 
        });
      }else if (this.data.text === 'punchIn') {
        this.punchTimeform.patchValue({ hour: 9, minute: 0 });
      } else if (this.data.text === 'punchOut') {
        this.punchTimeform.patchValue({ hour: 18, minute: 0 });
      }
  }

  async convertToUST(){
    const hour = this.punchTimeform.get('hour')?.value || 0;
    const minute = this.punchTimeform.get('minute')?.value || 0;

    // Construct the date string
    const dateString = `${this.data.date} ${hour}:${minute}:00`;
    //console.log(dateString);

    // Parse the date and convert to UTC
    const localDate = new Date(dateString);
    //console.log(`Local: ${localDate}`)
    return localDate;
  }
  
  async addPunchTime() {

    if (this.punchTimeform.valid && this.data.text === 'punchIn') {
      const time  = this.convertToUST()
      //console.log(time);
      const res = await this.punchTimeDialogService.punchInTimeform(time);
      const dialog = this.dialogRef.close(PunchTimeDialogComponent)
      this.snackBar.open('Punch In Successfully !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
    }else if (this.punchTimeform.valid && this.data.text === 'punchOut'){
      const time  = this.convertToUST();
      const attendenceId = this.data.attendenceId;
      //console.log(time);
      const res = await this.punchTimeDialogService.punchOutTimeform(time,attendenceId);
      const dialog = this.dialogRef.close(PunchTimeDialogComponent)
      this.snackBar.open('Punch Out Successfully !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-success']
      });
    } else{
      alert("Assign Valid Time for Punching")
    }
  }
}
