import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { IEmployee } from '../../../core/interfaces/iemployee';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css'
})
export class PieChartComponent implements OnInit {

  pieChart: any;
  constructor(private service : ApiService){

  }
  ngOnInit(): void {
    this.service.getAllData().subscribe(data => {
      this.printChart(this.service.getEmployeeWorkingHours(data));
    });
  }
  printChart(employees:IEmployee[]){
    const employeeData = this.getEmployeeData(employees);
    const employeeNames = employeeData.map((x)=>x.name);
    const employeePercentages = employeeData.map((x)=>x.percentage);
    this.pieChart=new Chart('pie-chart',{
      type:'pie',
      data:{
        labels: employeeNames,
        datasets:[{
          label: 'Working hours percetnage',
          data: employeePercentages,
          backgroundColor: ['#FFCCCB','#87CEEB','#98FF98','#E6E6FA','#F08080','#FFDAB9','#FFFFE0','#B0E0E6','#FAFAD2','#20B2AA'],
        }]
      },
      options: {
        aspectRatio:3
      }
    });
  }
  getEmployeeData(employees: IEmployee[]){
    let totalWorkHours = 0;
    employees.forEach(element => {
      totalWorkHours+= element.total_hours
    });
    return employees.map((x) => ({
      name: x.name,
      percentage: (x.total_hours/totalWorkHours)*100
    }));
  }
}
