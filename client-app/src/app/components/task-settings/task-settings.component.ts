import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { staticLabels, statuses, labelTypes } from './constants';
import * as moment from 'moment';
import { IDatePickerConfig } from 'ng2-date-picker';

// import { FormControl, FormGroup, FormBuilder, Validator, Validators,ReactiveFormsModule } from "@angular/forms";
@Component({
  selector: 'app-task-settings',
  templateUrl: './task-settings.component.html',
  styleUrls: ['./task-settings.component.scss']
})
export class TaskSettingsComponent implements OnInit {
  @Input() settings: any;
  @Input() listName: String;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() added: EventEmitter<any> = new EventEmitter();
  @Output() edited: EventEmitter<any> = new EventEmitter();
  title: String;
  labels: any = {};
  description: String;
  status: String = "new";
  availableLabels: any = {...staticLabels};
  objectEntries = Object.entries
  labelAddFormOpen: Boolean = false;
  customLabel: string;
  customLabelType: String = 'success';
  statuses: Array<object> = statuses;
  labelTypes: Array<object> = labelTypes;
  dueDate: string = '';
  minDate: any;
  datePickerConfig: IDatePickerConfig;
  datepickerDate: any;
  constructor(private taskService: TasksService) {
    this.datePickerConfig = {
      format: "YYYY-MM-DD"
    };
   }
  

  ngOnInit(): void {
    this.minDate = moment();
    this.availableLabels = this.settings && this.settings.labels ? Object.keys(staticLabels).reduce((acc, label) => {
      if (!this.settings.labels[label]) {
        acc[label] = staticLabels[label];
      }
      return acc;
    },{}) : Object.assign({}, staticLabels);
    if (this.listName) {
      this.status = this.listName;
      return;
    }
    this.title = this.settings.title;
    this.description = this.settings.description;
    this.status = this.settings.status || 'new';
    this.labels = this.settings.labels || {};
    this.dueDate = this.settings.dueDate;
    this.datepickerDate = this.settings.dueDate ? moment(this.settings.dueDate) : '';
  }
  saveTask() {
    const task = {
      id: this.settings && this.settings._id,
      title: this.title,
      description: this.description,
      labels: this.labels,
      status: this.status,
      dueDate: this.dueDate
    };
    this.taskService.saveTask(task).subscribe((data: any) => {
      if (data.success) {
        if (this.listName) {
          this.added.emit(data.task);
        } else {
          this.edited.emit(data.task);
        }
      }
    })
  }

  toggleLabelAddForm() {
    this.labelAddFormOpen = !this.labelAddFormOpen;
    if(!this.labelAddFormOpen) {
      this.customLabel = '';
    }
  }

  addLabel(label) {
    this.labels[label[0]] = label[1];
    delete this.availableLabels[label[0]];
  }

  removeLabel(label) {
    delete this.labels[label];
    if (staticLabels[label]) {
      this.availableLabels[label] = staticLabels[label];
    }
  }

  addCustomLabel() {
    this.labels[this.customLabel] = this.customLabelType;
    this.customLabel = '';
  }

  onDueDateChange(e) {
    if (e) {
      this.dueDate = e.format("YYYY-MM-DD");
    } else {
      this.dueDate = '';
    }
  }
}
