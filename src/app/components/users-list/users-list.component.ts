import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  arrUsers: User[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  perPage: number = 0;
  totalUsers: number = 0;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.goToPage(1);
  }

  async goToPage(pPage: number): Promise<void> {
    try {
      let response = await this.usersService.getAll(pPage);
      this.currentPage = response.page;
      this.totalPages = response.total_pages;
      this.perPage = response.per_page;
      this.totalUsers = response.total;
      this.arrUsers = response.data;
    } catch(err) {
      console.log(err);
    }
  }

}
