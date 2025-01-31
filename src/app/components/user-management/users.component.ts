import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { User, Permission } from '../../models/user.model';
import { SelectItem } from 'primeng/api';

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
    ToastModule,
    CheckboxModule,
    TabViewModule,
    DropdownModule
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
                  <button pButton 
                          icon="pi pi-key" 
                          class="p-button-rounded p-button-warning action-btn" 
                          (click)="managePermissions(user)"
                          *ngIf="!isAdminRole(user.role)">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- User Dialog -->
      <p-dialog [(visible)]="userDialog" 
                [modal]="true"
                [style]="{width: '450px'}"
                [header]="isNewUser ? 'Add New User' : 'Edit User'"
                appendTo="body">
        <div class="p-fluid">
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
            <div class="p-inputgroup">
              <input [type]="showPassword ? 'text' : 'password'" 
                     pInputText 
                     id="password" 
                     [(ngModel)]="selectedUser.password"
                     [required]="isNewUser"
                     [placeholder]="isNewUser ? 'Enter password' : 'Leave blank to keep current password'" />
              <button pButton 
                      type="button" 
                      icon="pi {{showPassword ? 'pi-eye-slash' : 'pi-eye'}}"
                      (click)="showPassword = !showPassword"
                      class="p-button-secondary">
              </button>
            </div>
          </div>
          <div class="field">
            <label for="role">Role</label>
            <p-dropdown id="role" 
                      [(ngModel)]="selectedUser.role" 
                      [options]="roleOptions" 
                      optionLabel="label" 
                      optionValue="value" 
                      [required]="true"
                      [appendTo]="'body'"
                      [style]="{'width':'100%'}"
                      placeholder="Select a role">
            </p-dropdown>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <button pButton 
                    label="Cancel" 
                    class="p-button-secondary cancel-button" 
                    (click)="hideDialog()">
            </button>
            <button pButton 
                    [label]="isNewUser ? 'Add' : 'Save'" 
                    class="p-button-success save-button" 
                    (click)="saveUser()">
            </button>
          </div>
        </ng-template>
      </p-dialog>

      <!-- Permissions Dialog -->
      <p-dialog [(visible)]="permissionsDialog" 
                [modal]="true"
                [style]="{width: '450px'}"
                header="Manage Permissions"
                appendTo="body">
        <div class="permissions-container">
          <div *ngFor="let route of availableRoutes" class="permission-item">
            <p-checkbox 
              [binary]="true"
              [ngModel]="hasPermission(route)"
              (ngModelChange)="togglePermission(route, $event)"
              [label]="formatRouteName(route)">
            </p-checkbox>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <div class="dialog-footer">
            <button pButton 
                    label="Cancel" 
                    class="p-button-secondary cancel-button" 
                    (click)="hidePermissionsDialog()">
            </button>
            <button pButton 
                    label="Save" 
                    class="p-button-success save-button" 
                    (click)="savePermissions()">
            </button>
          </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .content-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
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
      margin: 0;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #22C55E;
      display: inline-block;
      font-weight: 600;
    }

    .header-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-add {
      background: #3B82F6 !important;
      border-color: #3B82F6 !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      transition: all 0.2s ease !important;
    }

    .btn-add:hover {
      background: #2563EB !important;
      border-color: #2563EB !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
    }

    .btn-add i {
      font-size: 1rem;
    }

    .users-table {
      margin-top: 1rem;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    :host ::ng-deep .users-table .p-datatable-header {
      background: #FFFFFF;
      border: none;
      padding: 1.5rem 1.5rem 0;
    }

    :host ::ng-deep .users-table .p-datatable-thead > tr > th {
      background: #F3F4F6;
      border: none;
      border-bottom: 1px solid #E5E7EB;
      color: #374151;
      font-weight: 600;
      padding: 1rem 1.5rem;
    }

    :host ::ng-deep .users-table .p-datatable-tbody > tr {
      background: #FFFFFF;
      transition: background-color 0.2s;
    }

    :host ::ng-deep .users-table .p-datatable-tbody > tr:hover {
      background: #F9FAFB;
    }

    :host ::ng-deep .users-table .p-datatable-tbody > tr > td {
      border: none;
      border-bottom: 1px solid #E5E7EB;
      padding: 1rem 1.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .action-btn {
      width: 2.5rem !important;
      height: 2.5rem !important;
      padding: 0 !important;
    }

    .action-btn.p-button-rounded {
      border-radius: 50% !important;
    }

    .action-btn.p-button-success {
      background: #22C55E !important;
      border-color: #22C55E !important;
    }

    .action-btn.p-button-success:hover {
      background: #16A34A !important;
      border-color: #16A34A !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.2);
    }

    .action-btn.p-button-danger {
      background: #EF4444 !important;
      border-color: #EF4444 !important;
    }

    .action-btn.p-button-danger:hover {
      background: #DC2626 !important;
      border-color: #DC2626 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
    }

    .action-btn.p-button-warning {
      background: #F59E0B !important;
      border-color: #F59E0B !important;
    }

    .action-btn.p-button-warning:hover {
      background: #D97706 !important;
      border-color: #D97706 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
    }

    .status-admin {
      background-color: #FEF3C7;
      color: #92400E;
    }

    .status-user {
      background-color: #DBEAFE;
      color: #1E40AF;
    }

    :host ::ng-deep .p-dialog {
      border-radius: 12px;
      overflow: hidden;
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      background: #4CAF50;
      color: white;
      padding: 1.5rem;
      height: 72px;
      display: flex;
      align-items: center;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 2rem;
    }

    :host ::ng-deep .p-dialog .p-dialog-footer {
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
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

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-dropdown {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    :host ::ng-deep .p-inputtext:enabled:hover,
    :host ::ng-deep .p-dropdown:not(.p-disabled):hover {
      border-color: #22C55E;
    }

    :host ::ng-deep .p-inputtext:enabled:focus,
    :host ::ng-deep .p-dropdown:not(.p-disabled).p-focus {
      border-color: #22C55E;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
    }

    .permissions-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
    }

    .permission-item {
      padding: 0.75rem;
      border-radius: 8px;
      background: #F9FAFB;
      transition: background-color 0.2s;
    }

    .permission-item:hover {
      background: #F3F4F6;
    }

    :host ::ng-deep .p-checkbox .p-checkbox-box.p-highlight {
      background: #22C55E;
      border-color: #22C55E;
    }

    .dialog-footer {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    :host ::ng-deep .dialog-footer .cancel-button {
      background: #6B7280 !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      min-width: 100px !important;
    }

    :host ::ng-deep .dialog-footer .cancel-button:hover {
      background: #4B5563 !important;
    }

    :host ::ng-deep .dialog-footer .save-button {
      background: #22C55E !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      min-width: 100px !important;
    }

    :host ::ng-deep .dialog-footer .save-button:hover {
      background: #16A34A !important;
    }
  `],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = {} as User;
  userDialog: boolean = false;
  permissionsDialog: boolean = false;
  isNewUser: boolean = false;
  availableRoutes: string[] = [];
  showPassword: boolean = true;
  roleOptions: SelectItem[] = [
    { label: 'Admin', value: 'ROLE_ADMIN' },
    { label: 'User', value: 'ROLE_USER' }
  ];

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadAvailableRoutes();
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  loadAvailableRoutes() {
    this.permissionService.getAvailableRoutes().subscribe({
      next: (routes: string[]) => {
        this.availableRoutes = routes;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load available routes'
        });
      }
    });
  }

  openNew() {
    this.selectedUser = {} as User;
    this.isNewUser = true;
    this.userDialog = true;
    this.showPassword = true;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.selectedUser.password = '';
    this.isNewUser = false;
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
          error: (error: any) => {
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

  managePermissions(user: User) {
    this.selectedUser = { ...user };
    this.permissionsDialog = true;
    this.loadUserPermissions();
  }

  loadUserPermissions() {
    if (!this.selectedUser.id) {
      console.error('No user selected');
      return;
    }
    console.log('Loading permissions for user:', this.selectedUser.id);
    this.permissionService.getUserPermissions(this.selectedUser.id).subscribe({
      next: (permissions: Permission[]) => {
        console.log('Received permissions:', permissions);
        this.selectedUser.permissions = permissions;
      },
      error: (error: any) => {
        console.error('Failed to load permissions:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user permissions'
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
  }

  hidePermissionsDialog() {
    this.permissionsDialog = false;
  }

  saveUser() {
    if (this.isNewUser) {
      this.authService.saveUser(
        this.selectedUser.username,
        this.selectedUser.email,
        this.selectedUser.password || '',
        this.selectedUser.role || 'ROLE_USER'
      ).subscribe({
        next: () => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Created',
            life: 3000
          });
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user'
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
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user'
          });
        }
      });
    }
    this.userDialog = false;
    this.selectedUser = {} as User;
  }

  savePermissions() {
    if (!this.selectedUser.id || !this.selectedUser.permissions) {
      console.error('Invalid user or permissions');
      return;
    }

    // Ensure all routes have a permission entry
    const updatedPermissions: Permission[] = this.availableRoutes.map(route => {
      const existingPermission = this.selectedUser.permissions?.find(p => p.route === route);
      return {
        route,
        canAccess: existingPermission?.canAccess || false
      };
    });

    console.log('Saving permissions:', updatedPermissions);
    this.permissionService.updateUserPermissions(this.selectedUser.id, updatedPermissions)
      .subscribe({
        next: () => {
          console.log('Permissions updated successfully');
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Permissions Updated',
            life: 3000
          });
          this.permissionsDialog = false;
          // Reload the user's permissions
          this.loadUserPermissions();
        },
        error: (error: any) => {
          console.error('Failed to update permissions:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update permissions'
          });
        }
      });
  }

  hasPermission(route: string): boolean {
    if (!this.selectedUser.permissions) {
      return false;
    }
    const permission = this.selectedUser.permissions.find(p => p.route === route);
    return permission?.canAccess || false;
  }

  togglePermission(route: string, checked: boolean) {
    if (!this.selectedUser.permissions) {
      this.selectedUser.permissions = [];
    }

    const existingPermission = this.selectedUser.permissions.find(p => p.route === route);
    if (existingPermission) {
      console.log(`Updating permission for ${route} to ${checked}`);
      existingPermission.canAccess = checked;
    } else {
      console.log(`Adding new permission for ${route}: ${checked}`);
      this.selectedUser.permissions.push({
        route,
        canAccess: checked
      });
    }
    console.log('Updated permissions:', this.selectedUser.permissions);
  }

  formatRouteName(route: string): string {
    return route
      .replace(/^\//, '')
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' / ');
  }

  isAdminRole(role: string): boolean {
    return role === 'ROLE_ADMIN';
  }

  formatRole(role: string): string {
    return role.replace('ROLE_', '');
  }
}