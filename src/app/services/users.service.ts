import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import User from '../models/user.dto';
import users from '../../assets/mock-data/users.json';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private callEdit$: BehaviorSubject<string>;
  public editValue: Observable<string>;

  constructor(private httpClient: HttpClient) {
    this.callEdit$ = new BehaviorSubject<string>('');
    this.editValue = this.callEdit$.asObservable();
  }

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
  getUser(id: string): Observable<User> {
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const theUser = localUsers.find((user: User) => user.id === id);
    return of(theUser);
  }
  addUser(user: User): Observable<User> {
    let localUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser: User = {
      id: new Date().getTime().toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
    };

    localUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(localUsers));
    return of(newUser);
  }
  editUser(id: string, user: User): Observable<User[]> {
    let userToEdit = {
      id: new Date().getTime().toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
    let localUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    let editedArray = localUsers.map((user: User) => {
      if (user.id === id) {
        return userToEdit;
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(editedArray));
    return of(editedArray);
  }
  deleteUser(id: string): Observable<User[]> {
    let localUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    let filteredUsers = localUsers.filter((user: User) => user.id !== id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return of(filteredUsers);
  }

  public get getApiValue(): string {
    return this.callEdit$.value;
  }

  public setApiValue(value: string) {
    this.callEdit$.next(value);
  }
}
