import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import User from '../models/user.dto';
import users from '../../assets/mock-data/users.json';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  checkOrSetLocalUsers() {
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (localUsers.length) {
      // mock data'nın yapılan değişiklikleri değiştirmemesi için
      return;
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsers(): Observable<User[]> {
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const users = of(localUsers);
    return users;
  }
  addUser(payload: User): Observable<User> {
    const newUser: User = {
      id: new Date().toDateString(),
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
    };

    return of(newUser);
  }
}
