import { Component, OnInit } from '@angular/core';
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
import { Donor } from '../models/donor';
import { DonorService } from '../services/donor.service';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DonationService } from '../services/donation.service';

interface DonationHistory {
  amount: number;
  dateDonation: string;
  charityProjectName: string;
}

@Component({
  selector: 'app-donor',
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
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }

    .donor-container {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

    :host ::ng-deep .p-dialog {
      max-height: 90vh;
      overflow-y: auto;
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
    }

    .donor-form {
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
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    :host ::ng-deep .p-calendar,
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-inputnumber {
      width: 100%;
    }

    :host ::ng-deep .p-inputtext {
      width: 100%;
      padding: 0.7rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: border-color 0.3s, box-shadow 0.3s;
    }

    :host ::ng-deep .p-inputtext:focus {
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
      outline: none;
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
      border-color: #6B7280 !important;
    }

    .btn-action.p-button-success {
      background-color: #4CAF50 !important;
      border-color: #4CAF50 !important;
    }

    .header-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-add {
      background-color: #3B82F6 !important;
      border-color: #3B82F6 !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
    }

    .btn-delete-all {
      background-color: #EF4444 !important;
      border-color: #EF4444 !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 500 !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
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

    .input-field {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background: white;
      font-size: 0.95rem;
    }

    .btn-clear-filters {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #FFFFFF !important;
      border: 1px solid #E5E7EB !important;
      color: #6B7280 !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.25rem !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      height: fit-content;
      transition: all 0.2s ease;
    }

    .btn-clear-filters:hover {
      background: #F9FAFB !important;
      border-color: #D1D5DB !important;
      color: #4B5563 !important;
    }

    .btn-clear-filters i {
      font-size: 1rem;
      color: #6B7280;
    }

    .donor-table {
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-top: 2rem;
    }

    :host ::ng-deep .donor-table .p-datatable-header {
      background: #FFFFFF;
      border: none;
      padding: 1.5rem 1.5rem 0;
    }

    :host ::ng-deep .donor-table .p-datatable-thead > tr > th {
      background: #F3F4F6;
      border: none;
      border-bottom: 1px solid #E5E7EB;
      color: #374151;
      font-weight: 600;
      font-size: 0.938rem;
      padding: 1rem 1.5rem;
      text-align: left;
      text-transform: none;
      white-space: nowrap;
    }

    :host ::ng-deep .donor-table .p-datatable-thead > tr {
      background: #F3F4F6;
      border-radius: 8px 8px 0 0;
    }

    :host ::ng-deep .donor-table .p-datatable-tbody > tr {
      background: #FFFFFF;
      transition: background-color 0.2s;
    }

    :host ::ng-deep .donor-table .p-datatable-tbody > tr:hover {
      background: #F9FAFB;
    }

    :host ::ng-deep .donor-table .p-datatable-tbody > tr > td {
      border: none;
      border-bottom: 1px solid #E5E7EB;
      padding: 1rem 1.5rem;
      color: #374151;
    }

    :host ::ng-deep .donor-table .p-paginator {
      background: #FFFFFF;
      border: none;
      padding: 1rem;
    }

    :host ::ng-deep .donor-table .p-paginator .p-paginator-current {
      color: #6B7280;
    }

    :host ::ng-deep .donor-table .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 8px;
      color: #6B7280;
    }

    :host ::ng-deep .donor-table .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #3B82F6;
      color: #FFFFFF;
    }

    :host ::ng-deep .donor-table .p-paginator .p-paginator-first,
    :host ::ng-deep .donor-table .p-paginator .p-paginator-prev,
    :host ::ng-deep .donor-table .p-paginator .p-paginator-next,
    :host ::ng-deep .donor-table .p-paginator .p-paginator-last {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 8px;
      color: #6B7280;
    }

    :host ::ng-deep .donor-table .p-paginator button:not(.p-highlight):hover {
      background: #F3F4F6;
      color: #374151;
    }

    :host ::ng-deep .donor-table .p-datatable-tbody > tr:first-child > td {
      border-top: none;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    
    .action-btn {
      width: 2.5rem !important;
      height: 2.5rem !important;
      border-radius: 50% !important;
    }
    
    .action-btn.p-button-success {
      background-color: #22C55E !important;
      border-color: #22C55E !important;
    }
    
    .action-btn.p-button-danger {
      background-color: #EF4444 !important;
      border-color: #EF4444 !important;
    }

    :host ::ng-deep .p-inputtext:enabled:hover {
      border-color: #22C55E !important;
    }

    :host ::ng-deep .p-inputtext:enabled:focus {
      border-color: #22C55E !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
    }

    :host ::ng-deep .p-dropdown:not(.p-disabled):hover {
      border-color: #22C55E !important;
    }

    :host ::ng-deep .p-dropdown:not(.p-disabled).p-focus {
      border-color: #22C55E !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
    }

    :host ::ng-deep .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
      background: #22C55E !important;
      color: #FFFFFF !important;
    }

    :host ::ng-deep .p-calendar:not(.p-disabled):hover {
      border-color: #22C55E !important;
    }

    :host ::ng-deep .p-calendar:not(.p-disabled).p-focus {
      border-color: #22C55E !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
    }

    :host ::ng-deep .p-inputnumber:not(.p-disabled):hover .p-inputtext {
      border-color: #22C55E !important;
    }

    :host ::ng-deep .p-inputnumber:not(.p-disabled).p-focus .p-inputtext {
      border-color: #22C55E !important;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2) !important;
    }

    .action-btn {
      margin-right: 0.5rem;
    }

    .action-btn:last-child {
      margin-right: 0;
    }

    .p-button-info {
      background: #2196F3;
      border-color: #2196F3;
    }

    .p-button-info:hover {
      background: #1976D2;
      border-color: #1976D2;
    }

    .donation-history-container {
      padding: 1rem;
    }

    .donor-info {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .donor-info h3 {
      margin: 0;
      color: #2196F3;
    }

    .donation-table {
      margin-top: 1rem;
    }

    :host ::ng-deep .p-datatable {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :host ::ng-deep .p-datatable .p-datatable-header {
      background: #f8f9fa;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:nth-child(even) {
      background: #fafafa;
    }

    .text-center {
      text-align: center;
    }
  `],
  template: `
    <div class="donor-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="page-header">
        <div class="title">
          <h2>Donor Management</h2>
        </div>
        <div class="header-buttons">
          <button pButton 
                  label="+ Add New Donor" 
                  (click)="openNew()" 
                  class="btn-add">
          </button>
          <button pButton 
                  icon="pi pi-trash" 
                  label="Delete All" 
                  (click)="deleteAll()" 
                  class="btn-delete-all">
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-item">
          <label>
            <i class="pi pi-user"></i>
            <span>Name</span>
          </label>
          <input pInputText 
                 type="text" 
                 placeholder="Search by name..." 
                 [(ngModel)]="nameFilter" 
                 (input)="applyFilters()" 
                 class="input-field" />
        </div>
        <button pButton 
                class="btn-clear-filters"
                (click)="clearFilters()">
          <i class="pi pi-filter-slash"></i>
          Clear All Filters
        </button>
      </div>

      <div class="donor-table">
        <p-table [value]="donors" 
                 [tableStyle]="{'min-width': '50rem'}"
                 [paginator]="true" 
                 [rows]="10" 
                 [showCurrentPageReport]="false"
                 styleClass="donor-table"
                 selectionMode="single"
                 [selection]="selectedDonor"
                 (selectionChange)="selectedDonor = $event"
                 (onRowSelect)="onRowClick($event)">
          <ng-template pTemplate="header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-donor>
            <tr>
              <td>{{donor.id}}</td>
              <td>{{donor.name}}</td>
              <td>{{donor.email}}</td>
              <td>{{donor.phone}}</td>
              <td>{{donor.company}}</td>
              <td>{{donor.city}}</td>
              <td>
                <div class="action-buttons">
                  <button pButton 
                          icon="pi pi-pencil" 
                          class="action-btn p-button-rounded p-button-success"
                          (click)="editDonor(donor)">
                  </button>
                  <button pButton 
                          icon="pi pi-trash" 
                          class="action-btn p-button-rounded p-button-danger"
                          (click)="deleteDonor(donor)">
                  </button>
                  <button pButton 
                          icon="pi pi-history" 
                          class="action-btn p-button-rounded p-button-info"
                          (click)="viewDonationHistory(donor)" pTooltip="View Donation History">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="donorDialog" 
                [modal]="true" 
                [style]="{width: '80vw'}" 
                [maximizable]="true"
                [closable]="true"
                [closeOnEscape]="true"
                [dismissableMask]="true">
        <ng-template pTemplate="header">
          <div class="dialog-header">
            <h2>{{ donor.id ? 'Edit Donor' : 'Add New Donor' }}</h2>
          </div>
        </ng-template>
        <div class="donor-form">
          <div class="form-section">
            <h3>Donor Information</h3>
            <div class="field">
              <label for="name">Name</label>
              <input type="text" pInputText id="name" [(ngModel)]="donor.name" required autofocus />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input type="email" pInputText id="email" [(ngModel)]="donor.email" required />
            </div>
            <div class="field">
              <label for="phone">Phone</label>
              <input type="tel" pInputText id="phone" [(ngModel)]="donor.phone" required />
            </div>
            <div class="field">
              <label for="company">Company</label>
              <input type="text" pInputText id="company" [(ngModel)]="donor.company" />
            </div>
          </div>

          <div class="form-section">
            <h3>Address Information</h3>
            <div class="field">
              <label for="address">Address</label>
              <input type="text" pInputText id="address" [(ngModel)]="donor.address" />
            </div>
            <div class="field">
              <label for="city">City</label>
              <input type="text" pInputText id="city" [(ngModel)]="donor.city" />
            </div>
            <div class="field">
              <label for="state">State</label>
              <input type="text" pInputText id="state" [(ngModel)]="donor.state" />
            </div>
            <div class="field">
              <label for="zip">ZIP Code</label>
              <input type="text" pInputText id="zip" [(ngModel)]="donor.zip" />
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton label="Cancel" (click)="hideDialog()" class="p-button-secondary btn-action"></button>
          <button pButton label="Save" (click)="saveDonor()" class="p-button-success btn-action"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
})
export class DonorComponent implements OnInit {
  donors: Donor[] = [];
  filteredDonors: Donor[] = [];
  donor: Donor = {
    name: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    company: '',
    email: ''
  };
  donorDialog: boolean = false;
  submitted: boolean = false;
  nameFilter: string = '';
  selectedDonor: Donor | null = null;
  loadingDonations = false;

  constructor(
    private donorService: DonorService,
    private donationService: DonationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDonors();
  }

  loadDonors() {
    this.donorService.getDonors().subscribe(
      (data) => {
        this.donors = data;
        this.applyFilters();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load donors'
        });
      }
    );
  }

  applyFilters() {
    this.filteredDonors = this.donors;
    if (this.nameFilter) {
      this.filteredDonors = this.filteredDonors.filter(d => 
        d.name.toLowerCase().includes(this.nameFilter.toLowerCase())
      );
    }
  }

  clearFilters() {
    this.nameFilter = '';
    this.applyFilters();
  }

  openNew() {
    this.donor = {
      name: '',
      address: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      company: '',
      email: ''
    };
    this.submitted = false;
    this.donorDialog = true;
  }

  editDonor(donor: Donor) {
    this.donor = {...donor};
    this.donorDialog = true;
  }

  deleteDonor(donor: Donor) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + donor.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (donor.id) {
          this.donorService.deleteDonor(donor.id).subscribe(() => {
            this.donors = this.donors.filter(val => val.id !== donor.id);
            this.applyFilters();
            this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Donor Deleted', life: 3000});
          },
          error => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to delete donor', life: 3000});
          });
        }
      }
    });
  }

  deleteAll() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all donors? This action cannot be undone.',
      header: 'Delete All Donors',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, delete all',
      rejectLabel: 'No, keep all',
      accept: () => {
        this.donorService.deleteAll().subscribe({
          next: () => {
            this.donors = [];
            this.filteredDonors = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'All donors have been deleted',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting all donors:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete all donors. Please try again.',
              life: 3000
            });
          }
        });
      }
    });
  }

  hideDialog() {
    this.donorDialog = false;
    this.submitted = false;
  }

  saveDonor() {
    this.submitted = true;

    if (this.donor.name?.trim()) {
      if (this.donor.id) {
        this.donorService.updateDonor(this.donor.id, this.donor).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Donor Updated',
              life: 3000
            });
            this.loadDonors();
            this.hideDialog();
            this.nameFilter = ''; // Clear the name filter
            this.applyFilters(); // Refresh the table
          },
          error: (error: Error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update donor',
              life: 3000
            });
          }
        });
      } else {
        this.donorService.createDonor(this.donor).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Donor Created',
              life: 3000
            });
            this.loadDonors();
            this.hideDialog();
            this.nameFilter = ''; // Clear the name filter
            this.applyFilters(); // Refresh the table
          },
          error: (error: Error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create donor',
              life: 3000
            });
          }
        });
      }
    }
  }

  onRowClick(event: any) {
    if (event.data && event.data.id) {
      this.router.navigate(['/donors', event.data.id, 'history']);
    }
  }

  viewDonationHistory(donor: Donor) {
    if (donor.id !== undefined) {
      this.router.navigate(['/donors', donor.id, 'history']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid donor ID'
      });
    }
  }

  private getEmptyDonor(): Donor {
    return {
      name: '',
      address: '',
      phone: '',
      city: '',
      state: '',
      zip: '',
      company: '',
      email: ''
    };
  }
}
