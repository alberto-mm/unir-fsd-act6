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

  constructor(private usersService: UsersService) { }

  async ngOnInit(): Promise<void> {
    try {
      let response = await this.usersService.getAll();
      this.arrUsers = response.data;
    } catch(err) {
      console.log(err);
    }
  }

}
