import { Component, OnInit } from '@angular/core';
import { first, take, takeUntil } from 'rxjs';
import User from './models/user.dto';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  users: User[] = [];
  title = 'myliba';

  constructor(private usersService: UsersService) {
    usersService.checkOrSetLocalUsers();
  }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.usersService
      .getUsers()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.users = res;
        },
        error: (err) => console.log(err),
      });
  }
  usersChanged(val: boolean) {
    if (val) {
      this.getUsers();
    }
    return;
  }
}
