import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessAddEditComponent } from './business-add-edit/business-add-edit.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { BusinessService } from './business.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  displayedColumns: string[] = ['serialNumber', 'businessName', 'CIN_no', 'PAN_no', 'city', 'state', 'pinCode', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private businessService: BusinessService) { }

  openDetailsDialog(data: any) {
    // Fetch business details before opening the dialog
    this.businessService.getBusinessDetails(data.businessID).subscribe(
      (details) => {
        const dialogRef = this.dialog.open(BusinessDetailsComponent, {
          data: { businessData: data, businessDetails: details.data },
          width: '400px',
        });
      },
      (error) => {
        console.error('Error fetching business details:', error);
      }
    );
  }

  openAddEditDialog() {
    const dialogRef = this.dialog.open(BusinessAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getBusinessList();
        }
      }
    })
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  openEditForm(data: any){
    const dialogRef = this.dialog.open(BusinessAddEditComponent,{
      data,
    })
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getBusinessList();
        }
      }
    })
    // console.log(data);
  }

  toggleBusiness(row: any) {
  // Update the toggle state in the UI immediately
  row.isActive = !row.isActive;

  // Determine the live_sleep value to send to the API
  const live_sleepValue = row.isActive ? 1 : 0;

  // Call the API to update the business status
  this.businessService.updateBusinessStatus(row.businessID, live_sleepValue).subscribe(
    (response) => {
      console.log('Business status updated successfully:', response);
    },
    (error) => {
      console.error('Error updating business status:', error);
      // If the API call fails, revert the UI toggle state to the original value
      row.isActive = !row.isActive;
    }
  );
  }

  ngOnInit() {
    this.getBusinessList();
  }
  getBusinessList() {
    this.businessService.getBusinessList().subscribe({
      next: (res) => {
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
  
        // Iterate through the data and set the initial toggle state
        dataArray.forEach((item: any) => {
          item.isActive = item.live_sleep === 1;
        });
  
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
