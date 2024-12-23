import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { TravelExpenseMasterService } from './travel-expense-master.service';
import { EstimateTravelExpenseDetailsMasterComponent } from './estimate-travel-expense-details-master/estimate-travel-expense-details-master.component';
import { DisaprrovalDialogEstTravelComponent } from './disaprroval-dialog-est-travel/disaprroval-dialog-est-travel.component';

@Component({
  selector: 'app-travel-expense-master',
  templateUrl: './travel-expense-master.component.html',
  styleUrls: ['./travel-expense-master.component.css']
})
export class TravelExpenseMasterComponent {
  displayedColumns: string[] = ['serialNumber', 'employeeName', 'projectName', 'startDate', 'endDate', 'purpose', 'location', 'modeOfTransport','totalEstimateCost', 'viewDetails', 'status'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private TravelExpenseMasterService: TravelExpenseMasterService) { }

  ngOnInit(): void {
    this.loadtravelEstimate()
  }

  async loadtravelEstimate() {
    try {
      const res = await this.TravelExpenseMasterService.showAllEstTravelExpenses();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      const statusPriority: { [key: string]: number } = {
        Underprocess: 1,
        Approved: 2,
        Disapproved: 3
      };
  
      // Sort the data based on the custom status order
      const sortedData = dataArray.sort((a: any, b: any) => {
        const statusA = a.status as keyof typeof statusPriority;
        const statusB = b.status as keyof typeof statusPriority;
        return statusPriority[statusA] - statusPriority[statusB];
      });
  
      this.dataSource = new MatTableDataSource(sortedData);
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

  async openDetailsDialog(row: any) {
    const res = await this.TravelExpenseMasterService.getEstTravelExpenseDetails(row);
    // console.log(res);
    const dialogRef = this.dialog.open(EstimateTravelExpenseDetailsMasterComponent,{
      data: res
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadtravelEstimate();
        }
      }
    });
  }

  async onApprovalStatusChange(EstTravelHeadId: number, approvalStatus: string) {
    if (approvalStatus === 'Not Selected') return;

    if (approvalStatus === 'Disapproved') {
      const dialogRef = this.dialog.open(DisaprrovalDialogEstTravelComponent, {
        disableClose: true,
        width: '600px',
        data: { EstTravelHeadId }
      });

      dialogRef.afterClosed().subscribe(async (description: string) => {
        console.log(description);
        if (description === 'reload') {
          await this.loadtravelEstimate();
        }else{
          await this.loadtravelEstimate();
        }
      });

      return; // Return early to avoid updating the status without a description
    }

    // Immediate update for statuses other than "Disapproved"
    const body = { EstTravelHeadId, approvalStatus };
    try {
      const res: any = await this.TravelExpenseMasterService.updateApprovalStatus(body);
      if (res.success) {
        this.snackBar.open('Approval status updated successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-success'],
        });
        await this.loadtravelEstimate();
      }
    } catch (err) {
      this.snackBar.open('Error updating approval status', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error'],
      });
    }
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
