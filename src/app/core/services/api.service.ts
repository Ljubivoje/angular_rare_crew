import { Injectable } from '@angular/core';
import { IEmployee } from '../interfaces/iemployee';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL = 'https://rc-vault-fap-live-1.azurewebsites.net';

  constructor(private http: HttpClient) { 

  }
  getAllData(){
    const apiEndpoint = 'api/gettimeentries?code='
    const apiKey = 'vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';
    return this.http.get<any[]>(this.apiURL + '/' + apiEndpoint + apiKey);
  }
  getEmployeeWorkingHours(data : any[]):IEmployee[]{
    const employeeMap = new Map<string,number>();
    data.forEach(element => {
    if (element.DeletedOn != null) {
      console.error("Deleted.");
      return; 
    }
    if(element.EmployeeName == "" || element.EmployeeName==null){
      console.error("Employee's name can't be empty string or null");
      return;
    }
    if(!element.StarTimeUtc || !element.EndTimeUtc){   
      return;
    }
    const startTime = new Date(element.StarTimeUtc);
    const endTime = new Date(element.EndTimeUtc);
    if(isNaN(startTime.getTime()) || isNaN(endTime.getTime())){
      console.error("Invalid date values: ", startTime, endTime);
      return;
    }
    const wokringTimeInMiliseconds = endTime.getTime() - startTime.getTime();
    const totalWorkHours = Math.floor(wokringTimeInMiliseconds / 3600000);
    if(totalWorkHours<0){
      console.error(`Start time ${startTime} can't be greater than end time ${endTime}`);
      return;
    }
    if(employeeMap.has(element.EmployeeName)) {
      employeeMap.set(element.EmployeeName, employeeMap.get(element.EmployeeName)! + totalWorkHours);
    }
    else{
      employeeMap.set(element.EmployeeName, totalWorkHours);
    }
    });
    const employees: IEmployee[] = [];
    employeeMap.forEach((totalHours, name) => {
      employees.push({
        name,
        total_hours: totalHours,
        is_deleted: false
      });
      employees.sort((a,b)=>b.total_hours-a.total_hours);
    });
  return employees;
  }
}
