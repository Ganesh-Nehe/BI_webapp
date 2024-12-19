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
@Component({
  selector: 'app-travel-expense',
  templateUrl: './travel-expense.component.html',
  styleUrls: ['./travel-expense.component.css']
})
export class TravelExpenseComponent implements OnInit {

  displayedColumns: string[] = ['serialNumber', 'projectName', 'startDate', 'endDate', 'purpose', 'location', 'modeOfTransport','totalEstimateCost', 'viewDetails', 'status', 'edit'];
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
    const dialogRef = this.dialog.open(AddTravelExpenseComponent);
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
    const dialogRef = this.dialog.open(EstimateTravelExpenseDetailsComponent,{
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

  openDisapproveDetailDialog(row: any) {
    if (row.status === 'Disapproved') {
      const dialogRef = this.dialog.open(DisapprovaldialogesttravelComponent, {
        data: {
          EstTravelHeadId: row.EstTravelHeadId,
          description: row.description
        },
        width: '500px',
      });
    }
  }

  async openEditDialog(row: any) {
    if (row.status === 'Disapproved' || row.status === 'Underprocess' ) {
      const details = await this.TravelExpenseService.getEstTraveldetailsforId(row.EstTravelHeadId);
      const dialogRef = this.dialog.open(AddTravelExpenseComponent, {
        data: {estTravelHead : row, estTravelDetails : details}, // Pass selected row data for editing
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
    }else{
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
