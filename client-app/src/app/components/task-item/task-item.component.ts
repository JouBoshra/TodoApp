import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { statuses } from '../task-settings/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {
  @Input() task;
  @Input() showDueDate: boolean = true;
  @Input() showArchive: boolean = false;
  @Output() editTask: EventEmitter<any> = new EventEmitter();
  @Output() deleteTask: EventEmitter<any> = new EventEmitter();
  @Output() changeTaskStatus: EventEmitter<any> = new EventEmitter();
  @Output() archiveTask: EventEmitter<any> = new EventEmitter();
  @Output() edited: EventEmitter<any> = new EventEmitter();

  objectEntries = Object.entries;
  statuses = statuses
  status: String;
  dueDateLabel: any;
  showDetails: Boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.task.labels = this.task.labels || {}
    this.status = this.task.status;
    if (this.showDueDate) {
      this.dueDateLabel = this.getDueDateLabel();
    }
  }

  onStatusChange() {
    const payload = {
      oldStatus: this.task.status,
      newStatus: this.status,
      id: this.task._id
    };
    this.changeTaskStatus.emit(payload);
  }

  getDueDateLabel() {
    if (!this.showDueDate || !this.task.dueDate) return {};
    const date = moment(this.task.dueDate);
    const today = moment();
    if (date.isBefore(today, 'date')) {
      return { label: "Overdue: " + this.task.dueDate, type: 'danger' };
    } else if (date.isSame(today, 'date')) {
      return { label: "Due: Today" };
    } else if (date.isSame(today.add(1, 'day'), 'date')) {
      return { label: "Due: Tomorrow" };
    }
    return { label: 'Due on: ' + this.task.dueDate };
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }

  onEditTaskClick(e) {
    e.stopPropagation();
    this.editTask.emit(this.task);
  }

  onDeleteTaskClick(e) {
    e.stopPropagation();
    this.deleteTask.emit(this.task._id);
  }

  onArchiveTaskClick(e) {
    e.stopPropagation();
    this.archiveTask.emit(this.task._id);
  }

  onChangeStatusClick(e) {
    e.stopPropagation();
  }
}
