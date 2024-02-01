import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessAddEditComponent } from './business-add-edit/business-add-edit.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { BusinessService } from './business.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  displayedColumns: string[] = ['businessID', 'businessName', 'CIN_no', 'PAN_no', 'logoFileLocation', 'action'];
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
    this.dialog.open(BusinessAddEditComponent);
  }
  ngOnInit() {
    this.getBusinessList();
  }
  getBusinessList() {
    this.businessService.getBusinessList().subscribe({
      next: (res) => {
        console.log(res);
        const dataArray = Array.isArray(res.data) ? res.data : [];
        this.dataSource = new MatTableDataSource(dataArray);
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
