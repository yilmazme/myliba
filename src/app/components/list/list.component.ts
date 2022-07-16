import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import User from 'src/app/models/user.dto';
import AlertService from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'myl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() users: User[];
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // this.getUsers();
  }
  deleteUser(id: any) {
    AlertService.Alert(
      'Delete this user?',
      'Are you sure you want to delete this user?',
      'warning',
      true,
      true,
      'Yes, delete',
      'No, take me back'
    ).then((result) => {
      if (result.isConfirmed) {
        this.usersService
          .deleteUser(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              this.users = res;
            },
            error: (err) => console.log(err),
          });
      }
    });
  }
  editUser(id: any) {
    this.usersService.setApiValue(id);
  }
}
