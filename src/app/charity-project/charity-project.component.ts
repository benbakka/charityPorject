import { Component, OnInit } from '@angular/core';
import { CharityProject } from '../models/charity-project';
import { CharityProjectService } from '../services/charity-project.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Donor } from '../models/donor';
import { DonorService } from '../services/donor.service';

@Component({
  selector: 'app-charity-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    InputTextareaModule
  ],
  styles: [`
    :host {
      display: block;
    }

    .charity-project-container {
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

    .filter-section {
      display: flex;
      gap: 1.5rem;
      align-items: flex-end;
      margin-bottom: 2rem;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    }

    .filter-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-item label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6B7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .filter-item label i {
      color: #22C55E;
      font-size: 1rem;
    }

    .input-field:hover,
.select-field:hover,
:host ::ng-deep .p-dropdown:hover,
:host ::ng-deep .p-inputnumber input:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

    .filter-item input:hover,
    .filter-item .p-dropdown:hover,
    .filter-item .p-inputnumber:hover {
      border-color: #4CAF50;
    }


    .btn-clear-filters {
      height: 3rem;
      padding: 0 1rem;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #6B7280;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    .btn-clear-filters:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
      color: #4B5563;
    }

    .btn-clear-filters i {
      font-size: 0.875rem;
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

    .btn-add i {
      font-size: 1rem;
    }

    .btn-delete-all {
      background: #EF4444 !important;
      border: none !important;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
    }

    .btn-delete-all:hover {
      background: #DC2626 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .btn-delete-all i {
      font-size: 1rem;
    }

    :host ::ng-deep .p-datatable-card {
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
      background: #FFFFFF;
    }

    :host ::ng-deep .p-datatable-card .p-datatable-header {
      background: #FFFFFF;
      border: none;
      padding: 1.5rem;
    }

    :host ::ng-deep .p-datatable-card .p-datatable-thead > tr > th {
      background: #F3F4F6;
      border: none;
      border-bottom: 1px solid #E5E7EB;
      color: #4B5563;
      font-weight: 600;
      padding: 1rem 1.5rem;
    }

    :host ::ng-deep .p-datatable-card .p-datatable-tbody > tr {
      background: #FFFFFF;
      border-bottom: 1px solid #E5E7EB;
      transition: background-color 0.2s;
    }

    :host ::ng-deep .p-datatable-card .p-datatable-tbody > tr:hover {
      background: #F9FAFB;
    }

    :host ::ng-deep .p-datatable-card .p-datatable-tbody > tr:last-child {
      border-bottom: none;
    }

    :host ::ng-deep .p-datatable-card .p-datatable-tbody > tr > td {
      padding: 1rem 1.5rem;
      border: none;
    }

    :host ::ng-deep .p-datatable-card .p-paginator {
      background: #FFFFFF;
      border: none;
      padding: 1rem;
    }

    :host ::ng-deep .p-datatable-card .p-paginator .p-paginator-current {
      color: #6B7280;
    }

    :host ::ng-deep .p-datatable-card .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 0.5rem;
      color: #6B7280;
    }

    :host ::ng-deep .p-datatable-card .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #4B8BF5;
      color: #FFFFFF;
    }

    :host ::ng-deep .p-datatable-card .p-paginator button:not(.p-highlight):hover {
      background: #F3F4F6;
      color: #374151;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
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

    .status-badge {
      padding: 0.3rem 0.8rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-active {
      background-color: #E8F5E9;
      color: #2E7D32;
    }

    .status-completed {
      background-color: #E3F2FD;
      color: #1565C0;
    }

    .status-on-hold {
      background-color: #FFF8E1;
      color: #F57C00;
    }

    .status-cancelled {
      background-color: #FDEDED;
      color: #DC2626;
    }

    /* Modal Styles */
    :host ::ng-deep .p-dialog {
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 12px;
      overflow: hidden;
      z-index: 1000;
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      background: #4CAF50;
      color: white;
      padding: 1.5rem;
      height: 72px;
      display: flex;
      align-items: center;
    }

    .dialog-header h2 {
      color: white;
      font-size: 1.5rem;
      margin: 0;
      border: none;
      padding: 0;
      line-height: 1;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 0;
      border: none;
      background-color: white;
      overflow-y: auto;
    }

    :host ::ng-deep .p-dialog-mask {
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 999;
    }

    .project-form {
      padding: 2rem;
      background-color: white;
    }

    .form-section {
      padding: 1.5rem 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .form-section h3 {
      color: #2c3e50;
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #4CAF50;
      display: inline-block;
    }

    .field {
      margin-bottom: 1.5rem;
      max-width: 400px;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    :host ::ng-deep .p-dialog .p-dialog-footer {
      padding: 1.5rem 2rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
    }

    .btn-action {
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      border-radius: 8px !important;
    }

    .btn-action.p-button-secondary {
      background-color: #6B7280 !important;
      border-color: #4CAF50 !important;
    }

    .btn-action.p-button-success {
      background-color: #4CAF50 !important;
      border-color: #4CAF50 !important;
    }

    :host ::ng-deep .p-calendar {
      width: 100%;
      max-width: 400px;
    }

    :host ::ng-deep .p-calendar .p-inputtext {
      width: 100%;
    }

    :host ::ng-deep .p-dropdown {
      width: 100%;
      max-width: 400px;
    }

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-inputnumber,
    :host ::ng-deep .p-inputtextarea {
      width: 100%;
      max-width: 400px;
    }

    :host ::ng-deep .p-dropdown-panel {
      z-index: 1002 !important;
    }

    :host ::ng-deep .p-datepicker {
      z-index: 1002 !important;
    }

    :host ::ng-deep .p-dialog-mask {
      z-index: 999;
    }
  `],
  template: `
    <div class="charity-project-container">
      <div class="content-container">
        <p-toast></p-toast>
        <p-confirmDialog></p-confirmDialog>

        <div class="page-header">
          <div class="title">
            <h2>Charity Projects Management</h2>
          </div>
          <div class="header-buttons">
            <button pButton 
                    class="btn-add"
                    (click)="openNew()">
              <i class="pi pi-plus"></i>
              Add New Project
            </button>
            <button pButton 
                    class="btn-delete-all p-button-danger"
                    (click)="deleteAll()">
              <i class="pi pi-trash"></i>
              Delete All
            </button>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-item">
            <label>
              <i class="pi pi-search"></i>
              Project Name
            </label>
            <input type="text" 
                   pInputText 
                   [(ngModel)]="nameFilter" 
                   (input)="applyFilters()"
                   placeholder="Search by name...">
          </div>

          <div class="filter-item">
            <label>
              <i class="pi pi-tag"></i>
              Status
            </label>
            <p-dropdown [options]="statusOptions" 
                       [(ngModel)]="statusFilter"
                       (onChange)="applyFilters()"
                       placeholder="Select status"
                       [showClear]="true">
            </p-dropdown>
          </div>

          <div class="filter-item">
            <label>
              <i class="pi pi-dollar"></i>
              Target Amount
            </label>
            <p-inputNumber [(ngModel)]="targetAmountFilter"
                          (onInput)="applyFilters()"
                          mode="currency" 
                          currency="USD"
                          placeholder="Enter amount">
            </p-inputNumber>
          </div>

          <button class="btn-clear-filters"
                  (click)="clearFilters()">
            <i class="pi pi-filter-slash"></i>
            Clear Filters
          </button>
        </div>

        <p-table [value]="filteredProjects" 
                 [tableStyle]="{'min-width': '50rem'}"
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="false"
                 styleClass="p-datatable-card">
          <ng-template pTemplate="header">
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Goal</th>
              <th>Budget</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-project>
            <tr>
              <td>{{project.name}}</td>
              <td>{{project.date | date:'mediumDate'}}</td>
              <td>{{project.location}}</td>
              <td>{{project.goal}}</td>
              <td>{{project.budget | currency}}</td>
              <td>
                <span class="status-badge" [ngClass]="{
                  'status-active': project.status === 'Active',
                  'status-completed': project.status === 'Completed',
                  'status-on-hold': project.status === 'On Hold',
                  'status-cancelled': project.status === 'Cancelled'
                }">
                  {{ project.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-success action-btn" (click)="editProject(project)"></button>
                  <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger action-btn" (click)="deleteProject(project)"></button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <p-dialog [(visible)]="projectDialog" 
              [modal]="true"
              [style]="{width: '70vw'}"
              [draggable]="false"
              [resizable]="false">
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <h2>{{ project.id ? 'Edit Project' : 'Add New Project' }}</h2>
        </div>
      </ng-template>
      <div class="project-form">
        <div class="form-section">
          <h3>Project Information</h3>
          <div class="field">
            <label for="name">Project Name</label>
            <input type="text" pInputText id="name" [(ngModel)]="project.name" required autofocus />
          </div>
          <div class="field">
            <label for="date">Project Date</label>
            <p-calendar [(ngModel)]="project.date"
                       appendTo="body"
                       [showIcon]="true"
                       [style]="{'width':'100%', 'max-width': '400px'}"
                       dateFormat="dd/mm/yy">
            </p-calendar>
          </div>
          <div class="field">
            <label for="location">Location</label>
            <input type="text" pInputText id="location" [(ngModel)]="project.location" required />
          </div>
          <div class="field">
            <label for="goal">Project Goal</label>
            <textarea pInputTextarea id="goal" [(ngModel)]="project.goal" rows="3"></textarea>
          </div>
          <div class="field">
            <label for="budget">Budget</label>
            <p-inputNumber id="budget" [(ngModel)]="project.budget" mode="currency" currency="USD"></p-inputNumber>
          </div>
          <div class="field">
            <label for="status">Status</label>
            <p-dropdown id="status"
                      [(ngModel)]="project.status"
                      [options]="statuses"
                      optionLabel="label"
                      optionValue="value"
                      appendTo="body"
                      [style]="{'width':'100%', 'max-width': '400px'}"
                      placeholder="Select a Status">
            </p-dropdown>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="Cancel" (click)="hideDialog()" class="p-button-secondary btn-action"></button>
        <button pButton label="Save" (click)="saveProject()" class="p-button-success btn-action"></button>
      </ng-template>
    </p-dialog>
  `,
  providers: [MessageService, ConfirmationService]
})
export class CharityProjectComponent implements OnInit {
  projectDialog: boolean = false;
  projects: CharityProject[] = [];
  filteredProjects: CharityProject[] = [];
  project: CharityProject = this.getEmptyProject();
  submitted: boolean = false;
  statuses: any[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  nameFilter: string = '';
  statusFilter: string | null = null;
  targetAmountFilter: number | null = null;

  constructor(
    private charityProjectService: CharityProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.charityProjectService.getAllCharityProjects().subscribe({
      next: (projects) => {
        this.projects = projects.map(project => ({
          ...project,
          date: project.date ? new Date(project.date) : new Date()
        }));
        this.applyFilters();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load projects',
          life: 3000
        });
      }
    });
  }

  openNew() {
    this.project = this.getEmptyProject();
    this.submitted = false;
    this.projectDialog = true;
  }

  deleteProject(project: CharityProject) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (project.id) {
          this.charityProjectService.deleteCharityProject(project.id).subscribe(
            () => {
              this.projects = this.projects.filter(p => p.id !== project.id);
              this.applyFilters();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project deleted successfully'
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete project'
              });
            }
          );
        }
      }
    });
  }

  deleteAll() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all projects?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.charityProjectService.deleteAllCharityProjects().subscribe(
          () => {
            this.projects = [];
            this.applyFilters();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'All projects deleted successfully'
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete projects'
            });
          }
        );
      }
    });
  }

  editProject(project: CharityProject) {
    this.project = { ...project };
    this.project.date = new Date(project.date);
    this.projectDialog = true;
  }

  hideDialog() {
    this.projectDialog = false;
    this.submitted = false;
  }

  saveProject() {
    this.submitted = true;

    if (this.project.name?.trim()) {
      if (this.project.id) {
        this.charityProjectService.updateCharityProject(this.project.id, this.project).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Project Updated',
              life: 3000
            });
            this.loadProjects();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update project',
              life: 3000
            });
          }
        });
      } else {
        this.charityProjectService.createCharityProject(this.project).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Project Created',
              life: 3000
            });
            this.loadProjects();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create project',
              life: 3000
            });
          }
        });
      }
    }
  }

  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesName = !this.nameFilter || 
        project.name.toLowerCase().includes(this.nameFilter.toLowerCase());
      
      const matchesStatus = !this.statusFilter || 
        project.status === this.statusFilter;
      
      const matchesAmount = !this.targetAmountFilter || 
        project.budget >= this.targetAmountFilter;

      return matchesName && matchesStatus && matchesAmount;
    });
  }

  clearFilters() {
    this.nameFilter = '';
    this.statusFilter = null;
    this.targetAmountFilter = null;
    this.applyFilters();
  }

  private getEmptyProject(): CharityProject {
    return {
      name: '',
      date: new Date(),
      location: '',
      goal: '',
      budget: 0,
      status: 'Active'
    };
  }
}
