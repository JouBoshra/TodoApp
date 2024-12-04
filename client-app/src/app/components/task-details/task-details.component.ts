import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { staticLabels, statuses, labelTypes } from '../task-settings/constants';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: any;
  @Input() dueDate: any;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() edited: EventEmitter<any> = new EventEmitter();
  objectEntries = Object.entries
  editing: any = null;
  title: String;
  description: String;
  status: String;
  labels: any;
  statuses: Array<object> = statuses;
  newTitle: String;
  touched: Boolean = false;
  availableLabels: any = {};
  labelTypes: Array<Object> = labelTypes;
  showAddLabelForm: Boolean = false;
  customLabel: string = "";
  customLabelType: String = "info";

  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.title = this.task.title;
    this.description = this.task.description;
    this.status = this.task.status;
    this.labels = this.task.labels || {};
    this.availableLabels = Object.keys(staticLabels).reduce((acc, val) => {
      if (!this.labels[val]) {
        acc[val] = staticLabels[val];
      }
      return acc;
    }, {});
  }

  onContentEdit(key, evt) {
    this[key] = evt.target.innerText;
    this.touched = true;
  }

  addLabel(label = null) {
    if (!label) {
      if(!this.customLabel) return;
      this.labels[this.customLabel] = this.customLabelType;
      this.customLabel = '';
      this.touched = true;
      return;
    }
    this.labels[label[0]] = label[1];
    if (this.availableLabels[label[0]]) {
      delete this.availableLabels[label[0]];
    }
    this.touched = true;
  }

  removeLabel(label) {
    delete this.labels[label[0]];
    this.availableLabels[label[0]] = label[1];
    this.touched = true;
  }

  onEditSave() {
    const task = {...this.task};
    task.id = this.task._id;
    task.title = this.title;
    task.description = this.description;
    task.status = this.status;
    task.labels = this.labels;
    this.taskService.saveTask(task).subscribe((data: any) => {
      if (data.success) {
        data.task.oldStatus = this.task.status;
        this.edited.emit(data.task);
      }
    });
  }
}
