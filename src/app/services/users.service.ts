import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl: string = 'https://peticiones.online/api/users';

  constructor(private httpClient: HttpClient) { }

  getAll(): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(this.baseUrl));
  }

  getById(pId: number): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/${pId}`));
  }
}
