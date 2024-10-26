import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessAddEditComponent } from './business-add-edit/business-add-edit.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { BusinessService } from './business.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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

  async openDetailsDialog(data: any) {
    try {
      const details = await this.businessService.getBusinessDetails(data.businessID);
      this.dialog.open(BusinessDetailsComponent, {
        data: { businessData: data, businessDetails: details.data },
        width: '400px',
      });
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  }

  async openAddEditDialog() {
    const dialogRef = this.dialog.open(BusinessAddEditComponent);
    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      await this.getBusinessList();
    }
  }

  getSerialNumber(index: number): number {
    return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  async openEditForm(data: any) {
    const dialogRef = this.dialog.open(BusinessAddEditComponent, { data });
    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      await this.getBusinessList();
    }
  }

  async toggleBusiness(row: any) {
    row.isActive = !row.isActive;
    const live_sleepValue = row.isActive ? 1 : 0;

    try {
      await this.businessService.updateBusinessStatus(row.businessID, live_sleepValue);
      console.log('Business status updated successfully');
    } catch (error) {
      console.error('Error updating business status:', error);
      row.isActive = !row.isActive;
    }
  }

  async ngOnInit() {
    await this.getBusinessList();
  }

  async getBusinessList() {
    try {
      const res = await this.businessService.getBusinessList();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);

      dataArray.forEach((item: any) => {
        item.isActive = item.live_sleep === 1;
      });

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      console.log(err);
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
