import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-travel-statement-detail',
  templateUrl: './travel-statement-detail.component.html',
  styleUrls: ['./travel-statement-detail.component.css']
})
export class TravelStatementDetailComponent implements OnInit {
  categoryTotals: { [key: string]: number } = {};
  displayedColumns: string[] = ['projectName', 'startDate', 'endDate', 'location', 'purpose', 'modeOfTransport', 'advanceAmount', 'totalExpense', 'payableAmount'];
  expenseColumns: string[] = ['travelExpenseCatName', 'unitCost', 'expenseDate', 'remark', 'hasBill'];
  categoryColumns: string[] = ['costOfTravel', 'hotelStay', 'food', 'localTransport', 'entertainment'];
  total: number = 100
  @ViewChild('dialogContent') dialogContent!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.calculateCategoryTotals();
  }

  calculateCategoryTotals(): void {
    const categories = ['Cost of Travel', 'Hotel', 'Food', 'Local Transport', 'Entertianment'];
    // Initialize totals
    categories.forEach(category => {
      this.categoryTotals[category] = 0;
    });

    // Calculate totals for each category
    this.data.travelexpensedata.forEach((expense: any) => {
      const category = expense.travelExpenseCatName;
      const cost = expense.unitCost || 0;
      if (this.categoryTotals[category] !== undefined) {
        this.categoryTotals[category] += cost;
      }
    });
  }

}
