import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { TasksService } from '../../services/tasks.service';
import { filter } from 'rxjs/operators';
import { Map, List, fromJS } from 'immutable';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks: any = Map();
  objectEntries = Object.entries;
  taskToEdit = null; 
  labels: any = [];
  filteredTasks: any = Map();
  filters: any = {};
  constructor(private taskService: TasksService) { }
  immutableList = List;
  addingTaskInGroup: String = null;

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
      let labels = [];
      this.tasks = fromJS(data.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        if (!task.labels || task.labels instanceof Array) {
          task.labels = {};
        }
        labels = labels.concat(Object.keys(task.labels));
        return acc;
      }, {})).map((list) => list.sortBy((t) => t.get('order')));
      this.labels = Array.from(new Set(labels));
      this.filteredTasks = fromJS(this.tasks);
    });
  }

  addTask(listName) {
    this.addingTaskInGroup = listName;
  }

  taskAdded(task) {
    this.addingTaskInGroup = null;
    this.tasks = this.tasks.update(task.status, List(), (list) => list.push(fromJS(task)));
    if (this.applyFilterOnTask(task)) {
      this.filteredTasks = this.filteredTasks.update(task.status, List(), (list) => list.push(fromJS(task)));
    }
    this.labels = Array.from(new Set(this.labels.concat(Object.keys(task.labels || {}))));
  }

  editTask(task) {
    this.taskToEdit = task;
  }

  taskEdited(task) {
    const oldStatus = task.oldStatus || this.taskToEdit.status;
    if (oldStatus !== task.status) {
      this.tasks = this.tasks.update(task.status, List(), (list) => list.push(fromJS(task).sortBy((t) => t.get('order'))));
      this.tasks = this.tasks.update(oldStatus, List(), (list) => list.filter(t => t.get('_id') !== task.get('_id')));
    } else {
      this.tasks = this.tasks.update(task.status, List(), (list) => list.map((t) => {
        if (t.get('_id') === task._id) {
          return fromJS(task);
        }
        return t;
      }));
    }
    this.applyFilters();
    this.taskToEdit = null;
    this.labels = Array.from(new Set(this.labels.concat(Object.keys(task.labels || {}))));
  }

  closeDialog() {
    this.taskToEdit = null;
    this.addingTaskInGroup = null;
  }

  deleteTask(task) {
    this.taskService.deleteTask(task.id).subscribe((data: any) => {
      if (data.success) {
        this.tasks = this.tasks.update(task.listName, (list) => list.filter(t => t.get('_id') !== task.id));
        this.filteredTasks = this.filteredTasks.update(task.listName, (list) => list.filter(t => t.get('_id') !== task.id));
      }
    })
  }

  changeTaskStatus(payload) {
    this.taskService.changeStatus(payload).subscribe((data: any) => {
      if (data.success) {
        this.tasks = this.tasks.update(payload.oldStatus, (list) => list.filter(t => t.get('_id') !== payload.id));
        this.tasks = this.tasks.update(payload.newStatus, List(), (list) => list.push(fromJS(data.task)).sortBy((t) => t.get('order')));
        this.applyFilters();
      }
    })
  }

  filtersChanged(filters) {
    this.filters = filters;
    this.applyFilters();
  }

  applyFilters() {
    if (Object.keys(this.filters).length === 0) {
      this.filteredTasks = this.tasks;
    }
    this.filteredTasks = this.tasks.reduce((acc, list, status) => {
      return acc.set(status, list.filter((task) => this.applyFilterOnTask(task)));
    }, Map());
  }

  applyFilterOnTask(task) {
    if (this.filters.label && (!task.get('labels') || !task.getIn(['labels', this.filters.label]))) return false;
    if (this.filters.date && moment(task.get(this.filters.dateFilterName)).format('YYYY-MM-DD') !== this.filters.date) return false;
    if (this.filters.search && (!task.get('title').toLowerCase().match(this.filters.search.toLowerCase()) && !task.get('description').toLowerCase().match(this.filters.search.toLowerCase()))) return false;
    return true;
  }

  archiveTask(taskId = 'all') {
    this.taskService.archiveTasks(taskId).subscribe((data) => {
      this.tasks = this.tasks.update('completed', List(), (list) => list.map((task) => {
        if (taskId == 'all' || task.get('_id') === taskId) {
          return task.set('archived', true);
        }
        return task;
      }));
      this.filteredTasks = this.filteredTasks.update('completed', List(), (list) => list.map((task) => {
        if (taskId == 'all' || task.get('_id') === taskId) {
          return task.set('archived', true);
        }
        return task;
      }));
    })
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer.data === event.container.data) {
      if (event.previousIndex === event.currentIndex) return;
      const listName = event.container.data;
      let orders = [];
      this.filteredTasks = this.filteredTasks.update(listName, (list) => {
        const task = list.get(event.previousIndex);
        const newList = list.splice(event.previousIndex, 1).insert(event.currentIndex, task);
        orders = newList.map((item) => item.get('order')).sort().toJS();
        return newList.map((list, index) => {
          return list.set('order', orders[index])
        });
      });
      const newOrders = this.getNewOrders(listName);
      this.updateTaskOrders(listName, newOrders);
      this.taskService.updateOrders(newOrders).subscribe((data: any) => {
        if (data.success) {}
      });
    } else {
      const oldStatus = event.previousContainer.data;
      const newStatus = event.container.data;
      let movedTask = this.filteredTasks.getIn([oldStatus, event.previousIndex]).set('status', newStatus);
      this.filteredTasks = this.filteredTasks.update(oldStatus, (list) => list.filter((t) => t.get('_id') !== movedTask.get('_id')));
      this.tasks = this.tasks.update(oldStatus, (list) => list.filter((t) => t.get('_id') !== movedTask.get('_id')));
      let orders = [];
      this.filteredTasks = this.filteredTasks.update(newStatus, List(), (list) => {
        const newList = list.insert(event.currentIndex, movedTask);
        orders = newList.map((item) => item.get('order')).sort().toJS();
        return newList.map((item, index) => {
          return item.set('order', orders[index])
        });
      });
      this.tasks = this.tasks.update(newStatus, List(), (list) => list.push(movedTask));
      const newOrders = this.getNewOrders(newStatus);
      this.updateTaskOrders(newStatus, newOrders);
      this.taskService.updateOrders(newOrders).subscribe((data: any) => {
        if (data.success) {}
      });
      this.taskService.changeStatus({ oldStatus: oldStatus, newStatus: newStatus, id: movedTask.get('_id')}).subscribe((data) => {});
    }
  }

  getNewOrders(listName) {
    return this.filteredTasks.get(listName).reduce((acc, task) => {
      acc[task.get('_id')] = task.get('order');
      return acc;
    },{});
  }

  updateTaskOrders(listName, orders) {
    this.tasks = this.tasks.update(listName, List(), (list) => list.map((t) => {
      if (orders[t.get('_id')]) return t.set('order', orders[t.get('_id')]);
      return t;
    }).sortBy((t) => t.get('order')));
  }

}
