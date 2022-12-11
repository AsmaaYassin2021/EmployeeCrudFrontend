import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs'

import { EmployeeService } from '../_services/employee.service';
import { Employee } from '../models/employee';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  EmployeeList?: any[];
  
  EmployeeList1?: Observable<Employee[]>;
  employeeForm: any;
  message = "";
  id = 0;
  constructor(private formbulider: FormBuilder,
     private employeeService: EmployeeService,private router: Router,
     private jwtHelper : JwtHelperService,private toastr: ToastrService) { }
     ngOnInit() {
      
      this.employeeForm = this.formbulider.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        jobTitle: ['', [Validators.required]]
      });
      this.getEmployeeList();
    }
    getEmployeeList() {

      this.employeeService.getEmployeeList().subscribe({
        next: (response:any) => {
          console.log(response);
          this.EmployeeList = response.data;
        },
        error: (error) => {
          console.log(error);
          
        }
      });

    //  this.EmployeeList = this.EmployeeList1;
    }
    AddEmployee(employee: Employee) {
      const empInfo = this.employeeForm.value;
      this.employeeService.AddEmployee(empInfo).subscribe(
        () => {
          this.getEmployeeList();
          this.employeeForm.reset();
          this.toastr.success('Data Saved Successfully');
        }
      );
    }
    EmployeeDetailsToEdit(id: number) {
      this.employeeService.getEmployeeDetailsById(id).subscribe({
        next: (response:any) => {
          this.id = response.data.id;
        this.employeeForm.controls['firstName'].setValue(response.data.firstName);
        this.employeeForm.controls['lastName'].setValue(response.data.lastName);
        this.employeeForm.controls['phone'].setValue(response.data.phone);
        this.employeeForm.controls['jobTitle'].setValue(response.data.jobTitle);
        }
        ,
        error: (error) => {
          console.log(error);
          
        }
      });
    }
    UpdateEmployee(employee: Employee) {
      employee.id = this.id;
      const empData = this.employeeForm.value;
      this.employeeService.updateEmployee(empData).subscribe(() => {
        this.toastr.success('Data Updated Successfully');
        this.employeeForm.reset();
        this.getEmployeeList();
      });
    }
  
    DeleteEmployee(id: number) {
      if (confirm('Do you want to delete this employee?')) {
        this.employeeService.deleteEmployeeById(id).subscribe(() => {
          this.toastr.success('Data Deleted Successfully');
          this.getEmployeeList();
        });
      }
    }
    Clear(empData: Employee){
      this.employeeForm.reset();
    }
  
    public logOut = () => {
      localStorage.removeItem("jwt");
      this.router.navigate(["/"]);
    }
  
    isUserAuthenticated() {
      const token = localStorage.getItem("jwt");
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      }
      else {
        return false;
      }
    }
}
