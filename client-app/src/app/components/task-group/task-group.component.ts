import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { List, fromJS } from 'immutable';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.scss']
})
export class TaskGroupComponent implements OnInit {
  @Input() tasks;
  @Input() groupName;
  @Input() groupLabel;
  @Input() showDueDate: boolean = true;
  @Input() showArchive: boolean = false;
  @Output() editTask: EventEmitter<any> = new EventEmitter();
  @Output() deleteTask: EventEmitter<any> = new EventEmitter();
  @Output() changeTaskStatus: EventEmitter<any> = new EventEmitter();
  @Output() archiveTask: EventEmitter<any> = new EventEmitter();
  @Output() drop: EventEmitter<any> = new EventEmitter();
  @Output() addTask: EventEmitter<any> = new EventEmitter();
  @Output() edited: EventEmitter<any> = new EventEmitter();
  listId: string;
  showArchivedTasks: boolean = false;
  filteredTasks = List();
  constructor() { }

  ngOnInit(): void {
    this.listId = `taskList${this.groupName}`;
    this.filterTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === 'tasks' && changes[propName].currentValue && (!changes[propName].currentValue.equals(changes[propName].previousValue))) {
        this.filterTasks();
      }
    }
  }

  filterTasks() {
    if (!this.tasks) return;
    if (!this.showArchive) {
      this.filteredTasks = fromJS(this.tasks);
      return;
    }
    this.filteredTasks = this.tasks.filter((task) => this.showArchivedTasks || !task.get('archived'));
  }

  onTaskDelete(taskId) {
    const payload = {
      listName: this.groupName,
      id: taskId,
    }
    this.deleteTask.emit(payload);
  }

}
