import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../../../core/interfaces/iemployee';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  employees : IEmployee[] = [];
  constructor(private service : ApiService){
  }
  ngOnInit(): void {
    this.service.getAllData().subscribe(data => {
      this.employees = this.service.getEmployeeWorkingHours(data);
    });
  }
}
