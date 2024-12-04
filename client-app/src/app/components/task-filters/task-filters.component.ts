import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDatePickerConfig } from 'ng2-date-picker';
import { staticLabels } from '../task-settings/constants';

@Component({
  selector: 'app-task-filters',
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss']
})
export class TaskFiltersComponent implements OnInit {
  @Input() labels: object = staticLabels
  dateFilterName: string = '';
  datepickerDate: any;
  datePickerConfig: IDatePickerConfig;
  label: String = '';
  searchString: String = '';
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.datePickerConfig = {
      format: "YYYY-MM-DD"
    };
   }

  ngOnInit(): void {
  }

  applyFilters() {
    let filters = {};
    if (this.dateFilterName && this.datepickerDate) {
      filters['dateFilterName'] = this.dateFilterName;
      filters['date'] = this.datepickerDate.format('YYYY-MM-DD');
    }
    if (this.label) {
      filters['label'] = this.label;
    }
    if (this.searchString) {
      filters['search'] = this.searchString;
    }
    this.filtersChanged.emit(filters);
  }

  onChange() {
    this.applyFilters();
  }

  onKeyUp({ key }) {
    if (key === "Enter") {
      this.applyFilters();
    }
  }

  clear() {
    this.dateFilterName = '';
    this.datepickerDate = undefined;
    this.label = '';
    this.searchString = '';
    this.filtersChanged.emit({});
  }
}
