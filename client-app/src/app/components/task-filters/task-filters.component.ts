import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-task-filters',
  templateUrl: './task-filters.component.html',
  styleUrls: ['./task-filters.component.scss']
})
export class TaskFiltersComponent implements OnInit {
  @Input() labels: any[] = [];
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter();

  filter = {
    label: '',
    date: '',
    search: '',
    dateFilterName: 'dueDate'
  };

  constructor() { }

  ngOnInit(): void {
  }

  applyFilters() {
    this.filtersChanged.emit(this.filter);
  }

  clearFilters() {
    this.filter = {
      label: '',
      date: '',
      search: '',
      dateFilterName: 'dueDate'
    };
    this.filtersChanged.emit(this.filter);
  }
}
