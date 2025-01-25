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
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { EmailService } from '../services/email.service';

import { Donation } from '../models/donation';
import { DonationService } from '../services/donation.service';
import { CharityProjectService } from '../services/charity-project.service';
import { DonorService } from '../services/donor.service';
import { CharityProject } from '../models/charity-project';
import { Donor } from '../models/donor';

@Component({
  selector: 'app-donation',
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
    DropdownModule,
    CalendarModule
  ],
  template: `
    <div class="donation-list-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <div class="page-header">
        <div class="title">
          <h2>Donations Management</h2>
        </div>
        <div class="header-buttons">
          <button pButton 
                  class="btn-add"
                  (click)="openNew()">
            <i class="pi pi-plus"></i>
            Add New Donation
          </button>
          <button pButton 
                  class="btn-delete-all"
                  (click)="deleteAll()">
            <i class="pi pi-trash"></i>
            Delete All
          </button>
        </div>
      </div>

      <div class="filter-section">
        <div class="filter-item">
          <label>
            <i class="pi pi-user" style="color: #22C55E;"></i>
            Donor
          </label>
          <p-dropdown 
            [options]="donors" 
            [(ngModel)]="selectedDonor" 
            optionLabel="name"
            (onChange)="applyFilters()"
            [showClear]="true"
            styleClass="filter-dropdown"
            placeholder="All Donors"></p-dropdown>
        </div>
        <div class="filter-item">
          <label>
            <i class="pi pi-bookmark" style="color: #22C55E;"></i>
            Project
          </label>
          <p-dropdown 
            [options]="projects" 
            [(ngModel)]="selectedProject" 
            optionLabel="name"
            (onChange)="applyFilters()"
            [showClear]="true"
            styleClass="filter-dropdown"
            placeholder="All Projects"></p-dropdown>
        </div>
        <div class="filter-item">
          <button pButton 
                  class="clear-filters-btn"
                  (click)="clearFilters()">
            <i class="pi pi-filter-slash"></i>
            Clear All Filters
          </button>
        </div>
      </div>

      <p-table [value]="filteredDonations" 
               [tableStyle]="{'min-width': '50rem'}"
               [paginator]="true" 
               [rows]="10" 
               [showCurrentPageReport]="false"
               styleClass="donation-table">
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Donor Name</th>
            <th>Project Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-donation>
          <tr>
            <td>{{donation.id}}</td>
            <td>{{donation.donor.name}}</td>
            <td>{{donation.charityProject.name}}</td>
            <td>{{donation.amount | currency}}</td>
            <td>{{donation.dateDonation | date:'mediumDate'}}</td>
            <td>
              <div class="action-buttons">
                <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-success action-btn" (click)="editDonation(donation)"></button>
                <button pButton icon="pi pi-trash" class="p-button-rounded p-button-danger action-btn" (click)="deleteDonation(donation)"></button>
                <button pButton icon="pi pi-envelope" class="p-button-rounded p-button-info action-btn" (click)="sendTaxReceipt(donation)" pTooltip="Send Tax Receipt"></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

    <p-dialog [(visible)]="donationDialog" 
              [modal]="true" 
              [style]="{width: '80vw'}" 
              [maximizable]="true"
              [closable]="true"
              [closeOnEscape]="true"
              [dismissableMask]="true">
      <ng-template pTemplate="header">
        <div class="dialog-header">
          <h2>{{ donation.id ? 'Edit Donation' : 'Add New Donation' }}</h2>
        </div>
      </ng-template>
      <div class="donation-form">
        <div class="form-section">
          <h3>Donation Information</h3>
          <div class="field">
            <label for="donor">Donor</label>
            <p-dropdown id="donor" [options]="donors" [(ngModel)]="donation.donor" 
                      optionLabel="name" [filter]="true" filterBy="name" 
                      placeholder="Select a Donor" [showClear]="true"></p-dropdown>
            <small class="p-error" *ngIf="submitted && !donation.donor">Donor is required.</small>
          </div>
          <div class="field">
            <label for="project">Charity Project</label>
            <p-dropdown id="project" [options]="projects" [(ngModel)]="donation.charityProject" 
                      optionLabel="name" [filter]="true" filterBy="name" 
                      placeholder="Select a Project" [showClear]="true"></p-dropdown>
            <small class="p-error" *ngIf="submitted && !donation.charityProject">Project is required.</small>
          </div>
          <div class="field">
            <label for="amount">Amount</label>
            <p-inputNumber id="amount" [(ngModel)]="donation.amount" 
                         mode="currency" currency="USD" [min]="0"></p-inputNumber>
            <small class="p-error" *ngIf="submitted && donation.amount <= 0">Amount must be greater than 0.</small>
          </div>
          <div class="field">
              <label for="donationType">Donation Type</label>
              <p-dropdown 
                  [(ngModel)]="donation.donationType" 
                  [options]="[{label: 'One-Time', value: 'one-time'}, {label: 'Monthly', value: 'monthly'}]"
                  placeholder="Select Donation Type"
                  [showClear]="true">
              </p-dropdown>
              <small class="p-error" *ngIf="submitted && !donation.donationType">Donation type is required.</small>
          </div>
          <div class="field">
            <label for="donationDate">Donation Date</label>
            <p-calendar 
              id="donationDate" 
              [(ngModel)]="donation.dateDonation" 
              [yearRange]="calendarConfig.yearRange"
              [showTime]="calendarConfig.showTime"
              [dateFormat]="calendarConfig.dateFormat"
              [monthNavigator]="calendarConfig.monthNavigator"
              [yearNavigator]="calendarConfig.yearNavigator"
              [showIcon]="calendarConfig.showIcon"
              [readonlyInput]="calendarConfig.readonlyInput"
              [baseZIndex]="1100"
              [autoZIndex]="true"
              [appendTo]="'body'"
              styleClass="w-full"
              (onSelect)="onDateSelect($event)">
            </p-calendar>
            <small class="p-error" *ngIf="submitted && !donation.dateDonation">Date is required.</small>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="Cancel" (click)="hideDialog()" class="p-button-secondary btn-action"></button>
        <button pButton label="Save" (click)="saveDonation()" class="p-button-success btn-action"></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }

    .donation-list-container {
      padding: 2rem;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    h2 {
      color: #2c3e50;
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      border-bottom: 3px solid #4CAF50;
      padding-bottom: 0.5rem;
      display: inline-block;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .title {
      display: flex;
      align-items: center;
    }

    .header-buttons {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-add {
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      background-color: #3B82F6 !important;
      border-color: #3B82F6 !important;
      color: #FFFFFF !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 600 !important;
      transition: all 0.2s ease;
    }

    .btn-add:hover {
      background-color: #2563EB !important;
      border-color: #2563EB !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .btn-delete-all {
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
      background-color: #EF4444 !important;
      border-color: #EF4444 !important;
      color: #FFFFFF !important;
      border-radius: 8px !important;
      padding: 0.75rem 1.5rem !important;
      font-weight: 600 !important;
      transition: all 0.2s ease;
    }

    .btn-delete-all:hover {
      background-color: #DC2626 !important;
      border-color: #DC2626 !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    :host ::ng-deep .p-datatable {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    :host ::ng-deep .p-datatable .p-datatable-header {
      background: #f8f9fa;
      border: none;
      padding: 1rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
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

    :host ::ng-deep .p-datatable .p-datatable-thead > tr {
      background: #F3F4F6;
      border-radius: 8px 8px 0 0;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      transition: background-color 0.3s;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f5f9ff !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      border: none;
      border-bottom: 1px solid #f0f0f0;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:first-child > td {
      border-top: none;
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

    .donation-form {
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
      max-width: 300px;  /* Add fixed width for all fields */
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    :host ::ng-deep .p-calendar,
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-inputnumber,
    :host ::ng-deep .p-inputtext {
      width: 100% !important;
    }

    :host ::ng-deep .p-calendar .p-inputtext {
      width: calc(100% - 2.357rem) !important;  /* Account for calendar icon */
    }

    :host ::ng-deep .p-dropdown-panel,
    :host ::ng-deep .p-datepicker {
      min-width: 100%;
      max-width: 300px;
    }

    :host ::ng-deep .p-inputtext {
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: border-color 0.3s, box-shadow 0.3s;
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
      font-size: 1rem;
    }

    :host ::ng-deep .filter-dropdown {
      width: 100%;
      background: #FFFFFF;
    }

    :host ::ng-deep .filter-dropdown .p-dropdown {
      width: 100%;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      background: #FFFFFF;
    }

    :host ::ng-deep .filter-dropdown:not(.p-disabled):hover {
      border-color: #22C55E;
    }

    :host ::ng-deep .filter-dropdown:not(.p-disabled).p-focus {
      border-color: #22C55E;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
    }

    :host ::ng-deep .filter-dropdown .p-dropdown-panel {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      margin-top: 4px;
    }

    :host ::ng-deep .filter-dropdown .p-dropdown-item {
      padding: 0.75rem 1rem;
      color: #4B5563;
    }

    :host ::ng-deep .filter-dropdown .p-dropdown-item:hover {
      background: #F9FAFB;
    }

    :host ::ng-deep .filter-dropdown .p-dropdown-item.p-highlight {
      background: #22C55E;
      color: #FFFFFF;
    }

    .clear-filters-btn {
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

    .clear-filters-btn:hover {
      background: #F9FAFB !important;
      border-color: #D1D5DB !important;
      color: #4B5563 !important;
    }

    .clear-filters-btn i {
      font-size: 1rem;
      color: #6B7280;
    }

    .donation-table {
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    :host ::ng-deep .donation-table .p-datatable-header {
      background: #FFFFFF;
      border: none;
      padding: 1.5rem 1.5rem 0;
    }

    :host ::ng-deep .donation-table .p-datatable-thead > tr > th {
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

    :host ::ng-deep .donation-table .p-datatable-thead > tr {
      background: #F3F4F6;
      border-radius: 8px 8px 0 0;
    }

    :host ::ng-deep .donation-table .p-datatable-tbody > tr {
      background: #FFFFFF;
      transition: background-color 0.2s;
    }

    :host ::ng-deep .donation-table .p-datatable-tbody > tr:hover {
      background: #F9FAFB;
    }

    :host ::ng-deep .donation-table .p-datatable-tbody > tr > td {
      border: none;
      border-bottom: 1px solid #E5E7EB;
      padding: 1rem 1.5rem;
      color: #374151;
    }

    :host ::ng-deep .donation-table .p-datatable-tbody > tr:first-child > td {
      border-top: none;
    }

    :host ::ng-deep .donation-table .p-paginator {
      background: #FFFFFF;
      border: none;
      padding: 1rem;
    }

    :host ::ng-deep .donation-table .p-paginator .p-paginator-current {
      color: #6B7280;
    }

    :host ::ng-deep .donation-table .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 8px;
      color: #6B7280;
    }

    :host ::ng-deep .donation-table .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: #3B82F6;
      color: #FFFFFF;
    }

    :host ::ng-deep .donation-table .p-paginator .p-paginator-first,
    :host ::ng-deep .donation-table .p-paginator .p-paginator-prev,
    :host ::ng-deep .donation-table .p-paginator .p-paginator-next,
    :host ::ng-deep .donation-table .p-paginator .p-paginator-last {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.125rem;
      border-radius: 8px;
      color: #6B7280;
    }

    :host ::ng-deep .donation-table .p-paginator button:not(.p-highlight):hover {
      background: #F3F4F6;
      color: #374151;
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

    :host ::ng-deep .p-calendar {
      width: 100%;
    }

    :host ::ng-deep .p-calendar .p-inputtext {
      width: 100%;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }

    :host ::ng-deep .p-datepicker {
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      background: #FFFFFF;
      position: fixed !important;
    }

    :host ::ng-deep .p-datepicker:not(.p-datepicker-inline) {
      z-index: 1003 !important;
    }

    :host ::ng-deep .p-datepicker .p-datepicker-header {
      padding: 0.5rem;
      border-bottom: 1px solid #E5E7EB;
    }

    :host ::ng-deep .p-datepicker table {
      margin: 0.5rem 0;
    }

    :host ::ng-deep .p-datepicker table td {
      padding: 0.2rem;
    }

    :host ::ng-deep .p-datepicker table td > span {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      transition: all 0.2s;
    }

    :host ::ng-deep .p-datepicker table td > span:hover {
      background: #F3F4F6;
    }

    :host ::ng-deep .p-datepicker table td > span.p-highlight {
      background: #22C55E;
      color: #FFFFFF;
    }

    :host ::ng-deep .p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover {
      background: #F3F4F6;
    }
  `],
  providers: [MessageService, ConfirmationService]
})
export class DonationComponent implements OnInit {
  donationDialog: boolean = false;
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  donation: Donation = this.getEmptyDonation();
  submitted: boolean = false;
  donors: Donor[] = [];
  projects: CharityProject[] = [];
  selectedDonor: Donor | null = null;
  selectedProject: CharityProject | null = null;
  selectedDonationType: string = 'one-time';
  calendarConfig = {
    yearRange: '2020:2030',
    showTime: false,
    dateFormat: 'yy-mm-dd',
    monthNavigator: true,
    yearNavigator: true,
    showIcon: true,
    readonlyInput: true
  };

  constructor(
    private donationService: DonationService,
    private donorService: DonorService,
    private charityProjectService: CharityProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.loadDonations();
    this.loadDonors();
    this.loadProjects();
  }

  loadDonations() {
    this.donationService.getAllDonations().subscribe(
      (data) => {
        this.donations = data;
        console.log('Loaded donations:', this.donations);
        this.applyFilters();
      },
      (error) => {
        console.error('Error loading donations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load donations'
        });
      }
    );
  }

  loadDonors() {
    this.donorService.getDonors().subscribe(
      (data) => {
        this.donors = data;
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

  loadProjects() {
    this.charityProjectService.getAllCharityProjects().subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load projects'
        });
      }
    );
  }

  openNew() {
    this.donation = this.getEmptyDonation();
    this.submitted = false;
    this.donationDialog = true;
  }

  deleteDonation(donation: Donation) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this donation?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (donation.id) {
          this.donationService.deleteDonation(donation.id).subscribe(
            () => {
              this.donations = this.donations.filter(d => d.id !== donation.id);
              this.applyFilters();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Donation deleted successfully'
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete donation'
              });
            }
          );
        }
      }
    });
  }

  deleteAll() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all donations? This action cannot be undone.',
      header: 'Delete All Donations',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, delete all',
      rejectLabel: 'No, keep all',
      accept: () => {
        this.donationService.deleteAllDonations().subscribe({
          next: () => {
            this.donations = [];
            this.filteredDonations = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'All donations have been deleted',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error deleting all donations:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete all donations. Please try again.',
              life: 3000
            });
          }
        });
      }
    });
  }

  editDonation(donation: Donation) {
    console.log('Original donation date:', donation.dateDonation);
    // Create a deep copy and ensure date is a Date object
    this.donation = {
      ...donation,
      dateDonation: new Date(donation.dateDonation)
    };
    console.log('Editing donation with date:', this.donation.dateDonation);
    this.donationDialog = true;
  }

  hideDialog() {
    this.donationDialog = false;
    this.submitted = false;
  }

  saveDonation() {
    this.submitted = true;

    if (this.donation.donor && this.donation.charityProject && this.donation.amount > 0) {
      // Ensure we're working with a proper Date object
      if (typeof this.donation.dateDonation === 'string') {
        this.donation.dateDonation = new Date(this.donation.dateDonation);
      }

      console.log('Selected date before save:', this.donation.dateDonation);
      
      if (this.donation.id) {
        this.donationService.updateDonation(this.donation.id, this.donation).subscribe(
          (response) => {
            console.log('Response from update:', response);
            const index = this.donations.findIndex(d => d.id === this.donation.id);
            this.donations[index] = response;
            this.applyFilters();
            
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Donation updated successfully'
            });
            this.donationDialog = false;
            this.donation = this.getEmptyDonation();
          },
          (error) => {
            console.error('Error updating donation:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update donation'
            });
          }
        );
      } else {
        this.donationService.createDonation(this.donation).subscribe(
          (response) => {
            this.donations.push(response);
            this.applyFilters();
            
            try {
              const pdfBlob = this.emailService.generateTaxReceiptPDF(response);
              this.emailService.sendEmailWithTaxReceipt(response, pdfBlob).subscribe(
                () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Donation created and tax receipt sent successfully'
                  });
                },
                (error) => {
                  console.error('Error sending tax receipt:', error);
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Donation created but failed to send tax receipt'
                  });
                }
              );
            } catch (error) {
              console.error('Error generating PDF:', error);
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Donation created but failed to generate tax receipt'
              });
            }

            this.donationDialog = false;
            this.donation = this.getEmptyDonation();
          },
          (error) => {
            console.error('Error creating donation:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create donation'
            });
          }
        );
      }
    }
  }

  applyFilters() {
    this.filteredDonations = this.donations.filter(donation => {
      const matchesDonor = !this.selectedDonor || donation.donor.id === this.selectedDonor.id;
      const matchesProject = !this.selectedProject || donation.charityProject.id === this.selectedProject.id;
      return matchesDonor && matchesProject;
    });
  }

  clearFilters() {
    this.selectedDonor = null;
    this.selectedProject = null;
    this.applyFilters();
  }

  sendTaxReceipt(donation: Donation) {
    try {
      const pdfBlob = this.emailService.generateTaxReceiptPDF(donation);
      this.emailService.sendEmailWithTaxReceipt(donation, pdfBlob).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax receipt has been sent to donor\'s email'
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send tax receipt email'
          });
          console.error('Error sending tax receipt:', error);
        }
      );
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate tax receipt PDF'
      });
      console.error('Error generating PDF:', error);
    }
  }

  onDateSelect(event: any) {
    console.log('Selected date:', event);
  }

  onCalendarClickOutside(event: any) {
    const calendar = event.target.closest('.p-calendar');
    if (!calendar) {
      const overlayElement = document.querySelector('.p-datepicker');
      if (overlayElement) {
        overlayElement.classList.add('ng-hide');
      }
    }
  }

  private getEmptyDonation(): Donation {
    return {
      amount: 0,
      dateDonation: new Date(),
      donor: null as any,
      charityProject: null as any,
      donationType: 'one-time'
    };
  }
}
