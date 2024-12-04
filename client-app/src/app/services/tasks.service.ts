import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  apiEndpoint: string = ''; //'http://localhost:3000';
  userApiRoot: string = '/api/tasks';
  constructor(private http: HttpClient) { }

  getTasks() {
    return this.http.get(this.getRootApi())
  }

  getRootApi(route = '') {
    return `${this.apiEndpoint}${this.userApiRoot}${route}`;
  }

  saveTask(task) {
    return this.http.post(this.getRootApi('/save'), task);
  }

  deleteTask(taskId) {
    return this.http.delete(this.getRootApi(`/${taskId}`));
  }

  changeStatus(payload) {
    return this.http.post(this.getRootApi('/change-status'), payload);
  }

  archiveTasks(taskId = 'all') {
    return this.http.get(this.getRootApi('/archive/'+taskId));
  }

  updateOrders(newOrders) {
    return this.http.post(this.getRootApi('/update/order'), {taskOrders: newOrders});
  }
}
