import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  @Output() taskAdded: EventEmitter<any> = new EventEmitter();
  title: String;
  showMoreSettings: Boolean = false;
  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
  }

  onFormSubmit() {
    const task = {
      title: this.title,
    };
    this.taskService.saveTask(task).subscribe((data: any) => {
      if (data.success) {
        this.taskAdded.emit(data.task);
        this.title = '';
      }
    })
  }

  toggleMoreSettings(e) {
    e.preventDefault();
    this.showMoreSettings = !this.showMoreSettings;
  }

  closeMoreSettings() {
    this.showMoreSettings = false;
  }

  taskSaved(task) {
    this.taskAdded.emit(task);
    this.title = '';
    this.showMoreSettings = !this.showMoreSettings;
  }
}
