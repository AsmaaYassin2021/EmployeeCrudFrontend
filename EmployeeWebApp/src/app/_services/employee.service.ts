import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import configurl from '../../assets/config/config.json'
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url = configurl.apiServer.url + '/employee';
  constructor(private http: HttpClient) { }
  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }
  AddEmployee(employeeData: Employee): Observable<Employee> {
    const httpHeaders = { headers:new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.http.post<Employee>(this.url, employeeData, httpHeaders);
  }
  updateEmployee(employee: Employee): Observable<Employee> {
    const httpHeaders = { headers:new HttpHeaders({'Content-Type': 'application/json'}) };
    return this.http.put<Employee>(this.url, employee, httpHeaders);
  }
  deleteEmployeeById(id: number): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }
  getEmployeeDetailsById(id: number): Observable<Employee> {
    return this.http.get<Employee>(this.url + '/' + id);
  }
}