import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyService } from './currency.service';
import { AddCurrencyComponent } from './add-currency/add-currency.component';

@Component({
  selector: 'app-curreny',
  templateUrl: './curreny.component.html',
  styleUrls: ['./curreny.component.css']
})
export class CurrenyComponent implements OnInit {

  displayedColumns: string[] = ['sr no', 'Currency'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private currencyservice: CurrencyService) {}

  ngOnInit(): void {
    this.getVoucherHeadList();
  }

  async getVoucherHeadList() {
    try {
      const res = await this.currencyservice.getCurrencyList();
      const dataArray = Array.isArray(res.data) ? res.data : [];
      this.dataSource = new MatTableDataSource(dataArray);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error fetching currency list:', error);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddCurrencyComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getVoucherHeadList();
        }
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
