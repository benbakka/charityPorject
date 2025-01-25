import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="user-management-container">
      <div class="content-container">
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <div class="page-header">
          <div class="title">
            <h2>User Management</h2>
          </div>
          <div class="header-buttons">
            <button pButton 
                    class="btn-add"
                    (click)="openNew()">
              <i class="pi pi-plus"></i>
              Add New User
            </button>
          </div>
        </div>

        <p-table [value]="users" 
                 [tableStyle]="{'min-width': '50rem'}"
                 [paginator]="true" 
                 [rows]="10"
                 styleClass="p-datatable-card users-table">

          <ng-template pTemplate="header">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>  
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>{{user.id}}</td>
              <td>{{user.username}}</td>
              <td>{{user.email}}</td>
              <td>
                <span class="status-badge" [ngClass]="{
                  'status-admin': isAdminRole(user.role),
                  'status-user': !isAdminRole(user.role)
                }">
                  {{formatRole(user.role)}}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button pButton 
                          icon="pi pi-pencil" 
                          class="p-button-rounded p-button-success action-btn" 
                          (click)="editUser(user)">
                  </button>
                  <button pButton 
                          icon="pi pi-trash" 
                          class="p-button-rounded p-button-danger action-btn" 
                          (click)="deleteUser(user)">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="userDialog" 
                [modal]="true"
                [style]="{width: '450px'}"
                [header]="isNewUser ? 'Add New User' : 'Edit User'">
        <div class="field">
          <label for="username">Username</label>
          <input type="text" pInputText id="username" 
                 [(ngModel)]="selectedUser.username" 
                 required autofocus />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" pInputText id="email" 
                 [(ngModel)]="selectedUser.email" 
                 required />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input type="password" pInputText id="password" 
                 [(ngModel)]="selectedUser.password"
                 [required]="isNewUser"
                 [placeholder]="isNewUser ? 'Enter password' : 'Leave blank to keep current password'" />
        </div>
        <div class="field">
          <label for="role">Role</label>
          <select pInputText id="role" 
                  [(ngModel)]="selectedUser.role" 
                  required>
            <option value="ROLE_USER">User</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
        <ng-template pTemplate="footer">
          <button pButton pRipple label="Cancel" icon="pi pi-times" 
                  class="p-button-text" (click)="hideDialog()">
          </button>
          <button pButton pRipple [label]="isNewUser ? 'Add' : 'Save'" 
                  icon="pi pi-check" class="p-button-text" 
                  (click)="saveUser()">
          </button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 2rem;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .content-container {
      background: #FFFFFF;
      border-radius: 1rem;
      box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 2rem;
      margin: 0 auto;
      max-width: 100%;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .title h2 {
      color: #1F2937;
      font-size: 1.875rem;
      font-weight: 600;
      margin: 0;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #22C55E;
      display: inline-block;
    }

    .header-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-add {
      background: #4B8BF5 !important;
      border: none !important;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
    }

    .btn-add:hover {
      background: #3B7DE4 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-admin {
      background-color: #E3F2FD;
      color: #1565C0;
    }

    .status-user {
      background-color: #E8F5E9;
      color: #2E7D32;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    :host ::ng-deep .p-datatable {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 0.5rem;
      overflow: hidden;
    }

    :host ::ng-deep .p-datatable .p-datatable-header {
      background: #FFFFFF;
      border: none;
      padding: 1.5rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #F3F4F6;
      border: none;
      font-weight: 600;
      padding: 1rem 1.5rem;
      color: #4B5563;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      background: #FFFFFF;
      transition: background-color 0.2s;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #F9FAFB;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
    }

    .field select {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.375rem;
      border: 1px solid #D1D5DB;
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      background: #4CAF50;
      color: white;
      padding: 1.5rem;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 2rem;
    }

    :host ::ng-deep .p-dialog .p-dialog-footer {
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
    }

    :host ::ng-deep .users-table .p-paginator {
      background: #FFFFFF;
      border: none;
      padding: 1rem;
    }

    :host ::ng-deep .users-table .p-paginator .p-paginator-current {
      color: #6B7280;
    }

    :host ::ng-deep .users-table .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 8px;
      color: #6B7280;
    }

    :host ::ng-deep .users-table .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #3B82F6;
      color: #FFFFFF;
    }

    :host ::ng-deep .users-table .p-paginator .p-paginator-first,
    :host ::ng-deep .users-table .p-paginator .p-paginator-prev,
    :host ::ng-deep .users-table .p-paginator .p-paginator-next,
    :host ::ng-deep .users-table .p-paginator .p-paginator-last {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 8px;
      color: #6B7280;
    }

    :host ::ng-deep .users-table .p-paginator button:not(.p-highlight):hover {
      background: #F3F4F6;
      color: #374151;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = {} as User;
  userDialog: boolean = false;
  isNewUser: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  openNew() {
    this.selectedUser = {} as User;
    this.isNewUser = true;
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.username + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter(val => val.id !== user.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Deleted',
              life: 3000
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user'
            });
          }
        });
      }
    });
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isNewUser = false;
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
    this.selectedUser = {} as User;
  }

  saveUser() {
    if (this.selectedUser.username?.trim() && this.selectedUser.email?.trim()) {
      if (this.isNewUser) {
        if (!this.selectedUser.password) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Password is required for new users'
          });
          return;
        }
        this.authService.saveUser(
          this.selectedUser.username,
          this.selectedUser.email,
          this.selectedUser.password
        ).subscribe({
          next: () => {
            this.loadUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Created',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error || 'Failed to create user'
            });
          }
        });
      } else {
        this.authService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
          next: () => {
            this.loadUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'User Updated',
              life: 3000
            });
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error || 'Failed to update user'
            });
          }
        });
      }
    }
  }

  isAdminRole(role: string): boolean {
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  formatRole(role: string): string {
    if (role === 'ROLE_ADMIN' || role === 'ADMIN') return 'Admin';
    if (role === 'ROLE_USER' || role === 'USER') return 'User';
    return role;
  }
}