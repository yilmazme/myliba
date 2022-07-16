import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first, Subscription, take } from 'rxjs';
import User from 'src/app/models/user.dto';
import { UsersService } from 'src/app/services/users.service';
import { EventEmitter } from '@angular/core';
import AlertService from 'src/app/services/alert.service';

@Component({
  selector: 'myl-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  @Output() usersChanged: EventEmitter<boolean> = new EventEmitter();
  editId: string;
  userForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  mySubscribe: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      surname: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.minLength(2)]],
    });
    this.mySubscribe = this.usersService.editValue.subscribe((val) => {
      this.editId = val;
      if (!!this.editId) {
        this.patchUser();
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.userForm.invalid) {
      return;
    }

    if (this.editId) {
      this.editUser();
    } else {
      this.addUser();
    }
  }
  addUser() {
    const newUser: User = {
      name: this.userForm.get('name')?.value,
      surname: this.userForm.get('surname')?.value,
      email: this.userForm.get('email')?.value,
    };
    this.usersService
      .addUser(newUser)
      .pipe(first())
      .subscribe({
        next: (res) => {
          AlertService.Alert(
            'User added',
            'user added successfully',
            'success'
          ).then(() => {
            this.usersChanged.emit(true);
            this.userForm.reset();
            this.submitted = false;
            this.loading = false;
            this.editId = '';
          });
        },
        error: () =>
          AlertService.Alert('User not added', 'Something went wrong', 'error'),
      });
  }
  editUser() {
    const newUser: User = {
      name: this.userForm.get('name')?.value,
      surname: this.userForm.get('surname')?.value,
      email: this.userForm.get('email')?.value,
    };
    this.usersService
      .editUser(this.editId, newUser)
      .pipe(first())
      .subscribe({
        next: (res) => {
          AlertService.Alert(
            'User updated',
            'user updated successfully',
            'success'
          ).then(() => {
            this.usersChanged.emit(true);
            this.userForm.reset();
            this.submitted = false;
            this.loading = false;
            this.editId = '';
          });
        },
        error: () =>
          AlertService.Alert(
            'User not updated',
            'Something went wrong',
            'error'
          ),
      });
  }

  patchUser() {
    this.usersService
      .getUser(this.editId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.userForm.patchValue({
            name: res.name,
            surname: res.surname,
            email: res.email,
          });
        },
        error: (err) => console.log(err),
      });
  }

  resetForm() {
    this.userForm.reset();
    this.editId = '';
  }
  ngOnDestroy(): void {
    this.mySubscribe.unsubscribe();
  }
}
