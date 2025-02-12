import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { AddTravelExpenseComponent } from './add-travel-expense/add-travel-expense.component'
import { TravelExpenseService } from './travel-expense.service'
import { EstimateTravelExpenseDetailsComponent } from './estimate-travel-expense-details/estimate-travel-expense-details.component'
import { DisapprovaldialogesttravelComponent } from './disapprovaldialogesttravel/disapprovaldialogesttravel.component'
import { TravelExpenseStatementComponent } from './travel-expense-statement/travel-expense-statement.component';
import { TravelStatementDetailComponent } from './travel-statement-detail/travel-statement-detail.component';
import { DisapprovaldialogstatementComponent } from './disapprovaldialogstatement/disapprovaldialogstatement.component';

import * as e from 'cors';
@Component({
  selector: 'app-travel-expense',
  templateUrl: './travel-expense.component.html',
  styleUrls: ['./travel-expense.component.css']
})
export class TravelExpenseComponent implements OnInit {

  displayedColumns: string[] = ['serialNumber', 'projectName', 'startDate', 'endDate', 'purpose', 'location', 'modeOfTransport', 'totalEstimateCost', 'viewDetails', 'status', 'edit', 'advancePayment', 'createStatement', 'viewStatementDetails', 'travelDocument', 'approval', 'editStatement', 'submit', 'travelPayment'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private TravelExpenseService: TravelExpenseService) { }

  ngOnInit(): void {
    this.loadtravelEstimate()
  }

  async loadtravelEstimate() {
    try {
      const res = await this.TravelExpenseService.showAllEstTravelExpenses();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray.reverse());
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      this.snackBar.open('Error loading estimate travel expense list', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  async openAddDialog() {
    const dialogRef = this.dialog.open(AddTravelExpenseComponent,{disableClose: true});
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadtravelEstimate();
        }
      }
    });
  }

  async openDetailsDialog(row: any) {
    const res = await this.TravelExpenseService.getEstTravelExpenseDetails(row);
    // console.log(res);
    const dialogRef = this.dialog.open(EstimateTravelExpenseDetailsComponent, {
      data: { res, row },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadtravelEstimate();
        }
      }
    });
  }

  openDisapproveDetailDialog(row: any) {
    if (row.status === 'Disapproved') {
      const dialogRef = this.dialog.open(DisapprovaldialogesttravelComponent, {
        data: {
          EstTravelHeadId: row.EstTravelHeadId,
          description: row.description
        },
        width: '500px',
        disableClose: true
      });
    }
  }

  async openEditDialog(row: any) {
    if (row.status === 'Disapproved' || row.status === 'Underprocess') {
      const details = await this.TravelExpenseService.getEstTraveldetailsforId(row.EstTravelHeadId);
      const dialogRef = this.dialog.open(AddTravelExpenseComponent, {
        data: { estTravelHead: row, estTravelDetails: details }, // Pass selected row data for editing
        disableClose: true
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.loadtravelEstimate(); // Reload voucher list on update
          }
        }
      });
    } else if (row.status === 'Approved') {
      this.snackBar.open('Cannot edit as estimate expense is now Approved', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else {
      this.snackBar.open('Error', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  async createStatement(row: any) {
    if (row.status === 'Approved' && row.travelId === null) {
      const details = await this.TravelExpenseService.getEstTraveldetailsforId(row.EstTravelHeadId);
      const dialogRef = this.dialog.open(TravelExpenseStatementComponent, {
        data: { estTravelHead: row, form: 'saveStatement' }, // Pass selected row data for editing
        disableClose: true
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.loadtravelEstimate(); // Reload voucher list on update
          }
        }
      });
    } else if (row.status === 'Disapproved' || row.status === 'Underprocess') {
      this.snackBar.open('Cannot create statement as estimate expense is not yet approved', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else if (row.travelId !== null) {
      this.snackBar.open('Expense already created, Use Edit ', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    } else {
      this.snackBar.open('Error', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  async openStatementDetailsDialog(row: any) {
    if (row.travelId !== null) {
      const res = await this.TravelExpenseService.getTravelExpenseDetails(row);
      const dialogRef = this.dialog.open(TravelStatementDetailComponent, {
        data: res,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.loadtravelEstimate();
          }
        }
      });
    } else {
      this.snackBar.open('Travel Statement not created yet !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openDocument(file_location: string) {

    // Replace backslashes with forward slashes if needed (for URL encoding)
    if (file_location !== null) {
      const normalizedLocation = file_location.replace(/\\/g, '/');
      const encodedFileLocation = encodeURIComponent(normalizedLocation);

      this.TravelExpenseService.getDocument(encodedFileLocation).subscribe((response: HttpResponse<Blob>) => {
        if (response.body) {
          // Create a Blob from the response body and specify the correct MIME type for PDF
          const blob = new Blob([response.body], { type: 'application/pdf' });

          // Create a URL for the Blob and open it in a new tab
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
        } else {
          this.snackBar.open('Response is Null', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-error'],
          });
        }
      }, error => {
        this.snackBar.open('No file found on server', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error'],
        });
      });
    } else {
      this.snackBar.open('Travel Statement not created yet !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    }
  }

    async clickSubmit(row: any) {
      try {
        const details = await this.TravelExpenseService.submitExpense(row.travelId)
        this.snackBar.open('Travel Expense Submitted Successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success']
        });
        this.loadtravelEstimate();
      } catch (error) {
        this.snackBar.open('Error submitting Travel expense', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }

  async openPaymentDocument(travelPayment: boolean, file_location: string, row: any) {
    if (!travelPayment) {
      this.snackBar.open('Payment is not proceed yet !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    } else {
      this.openDocument(file_location);
    }
  }

  async openTravelEditDialog(row: any) {
    if (row.travelStatus === 'Disapproved' || row.travelStatus === 'Underprocess') {
      const details = await this.TravelExpenseService.getTravelExpenseDetails(row);
      const dialogRef = this.dialog.open(TravelExpenseStatementComponent, {
        data: { TravelDetails: details, form: 'updateStatement' },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result) {
            this.loadtravelEstimate(); // Reload voucher list on update
          }
        }
      });
    } else if (row.travelStatus === 'Approved') {
      this.snackBar.open('Cannot edit as expense is now Approved', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else if (row.travelStatus === null) {
      this.snackBar.open('Travel Statement not created yet !', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else {
      this.snackBar.open('Error', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }

  openStatementDisapproveDetailDialog(row: any) {
    if (row.travelStatus === 'Disapproved') {
      const dialogRef = this.dialog.open(DisapprovaldialogstatementComponent, {
        data: {
          travelId: row.travelId,
          travelDescription: row.travelDescription,
        },
        width: '500px',
        disableClose: true
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
