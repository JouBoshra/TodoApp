import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = '/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  addTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, task);
  }

  editTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }

  changeStatus(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-status`, payload);
  }

  archiveTasks(taskId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/archive/${taskId}`);
  }

  updateOrders(taskOrders: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/order`, { taskOrders });
  }
}
