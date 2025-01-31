import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

import { DonationService } from '../../services/donation.service';
import { Donation, DonationDTO } from '../../models/donation';
import { DonorService } from '../../services/donor.service';
import { EmailService } from '../../services/email.service';
import { CharityProjectService } from '../../services/charity-project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Donor } from '../../models/donor';
import { CharityProject } from '../../models/charity-project';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    ToastModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="donation-history-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Donor Details Section -->
      <div class="donor-details" *ngIf="donor">
        <h2>Donor Details</h2>
        <div class="donor-info">
          <div class="info-item">
            <span class="info-label">Name</span>
            <span class="info-value">{{donor.name}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{donor.email}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone</span>
            <span class="info-value">{{donor.phone}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Address</span>
            <span class="info-value">{{donor.address}}</span>
          </div>
          <div class="info-item" *ngIf="donor.addressTwo">
            <span class="info-label">Address Line 2</span>
            <span class="info-value">{{donor.addressTwo}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">City</span>
            <span class="info-value">{{donor.city}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">State</span>
            <span class="info-value">{{donor.state}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Country</span>
            <span class="info-value">{{donor.country}}</span>
          </div>
          <div class="info-item">
            <span class="info-label">ZIP Code</span>
            <span class="info-value">{{donor.zip}}</span>
          </div>
        </div>
      </div>

      <div class="header">
        <h1>Donation History</h1>
        <div class="header-actions">
          <button pButton label="Add Donation" 
                  icon="pi pi-plus" 
                  class="p-button-success"
                  (click)="openDonationDialog()"></button>
          <button pButton label="Email Report" 
                  icon="pi pi-envelope" 
                  class="p-button-primary"
                  [loading]="sendingEmail"
                  (click)="sendEmailReport()"></button>
          <button pButton label="Back to Donors" 
                  icon="pi pi-arrow-left" 
                  class="p-button-secondary"
                  (click)="navigateBack()"></button>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <div class="date-filters">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">From</span>
            <p-calendar [(ngModel)]="startDate" 
                      [showIcon]="true"
                      dateFormat="mm/dd/yy"
                      placeholder="Start date"
                      (onSelect)="onDateSelect()"></p-calendar>
          </div>
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">To</span>
            <p-calendar [(ngModel)]="endDate" 
                      [showIcon]="true"
                      dateFormat="mm/dd/yy"
                      placeholder="End date"
                      (onSelect)="onDateSelect()"></p-calendar>
          </div>
          <button pButton 
                  icon="pi pi-times" 
                  class="p-button-rounded p-button-text"
                  pTooltip="Clear filter"
                  *ngIf="startDate || endDate"
                  (click)="clearDateFilter()"></button>
        </div>
      </div>

      <div class="total-donations">
        <h2>TOTAL DONATIONS</h2>
        <h1>{{totalAmount | currency}}</h1>
      </div>

      <!-- Donations Table -->
      <p-table [value]="filteredDonations" [paginator]="true" [rows]="10" 
               [globalFilterFields]="['amount','dateDonation','charityProject.name']"
               [tableStyle]="{'min-width': '75rem'}">
        <ng-template pTemplate="header">
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Project</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-donation>
          <tr>
            <td>{{donation.amount | currency}}</td>
            <td>{{donation.dateDonation | date:'mediumDate'}}</td>
            <td>{{donation.charityProject.name}}</td>
            <td>{{donation.donationType}}</td>
            <td>
              <button pButton icon="pi pi-pencil" 
                      class="p-button-rounded p-button-success mr-2"
                      (click)="editDonation(donation)"></button>
              <button pButton icon="pi pi-trash" 
                      class="p-button-rounded p-button-danger mr-2"
                      (click)="confirmDelete(donation)"></button>
              <button pButton icon="pi pi-envelope" 
                      class="p-button-rounded p-button-info"
                      [loading]="sendingEmail && emailDonationId === donation.id"
                      (click)="sendSingleDonationEmail(donation)"></button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5" class="text-center">No donations found</td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Donation Dialog -->
      <p-dialog [(visible)]="donationDialog" 
                [style]="{width: '450px'}" 
                [header]="editMode ? 'Edit Donation' : 'Add Donation'" 
                [modal]="true"
                [draggable]="false"
                [resizable]="false">
        <div class="donation-form">
          <div class="field">
            <label for="amount">Amount</label>
            <input type="number" pInputText id="amount" 
                   [(ngModel)]="currentDonation.amount" required>
          </div>

          <div class="field">
            <label for="project">Project</label>
            <p-dropdown [options]="projects" 
                       [(ngModel)]="currentDonation.charityProject"
                       optionLabel="name"
                       [filter]="true" 
                       filterBy="name"
                       placeholder="Select a Project"></p-dropdown>
          </div>

          <div class="field">
            <label for="date">Date</label>
            <p-calendar [(ngModel)]="currentDonation.dateDonation" 
                       [showIcon]="true"
                       dateFormat="dd/mm/yy"></p-calendar>
          </div>

          <div class="field">
            <label for="type">Donation Type</label>
            <p-dropdown [options]="donationTypes" 
                       [(ngModel)]="currentDonation.donationType"
                       placeholder="Select Type"></p-dropdown>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="Cancel" icon="pi pi-times" 
                  class="p-button-text" (click)="closeDonationDialog()"></button>
          <button pButton label="Save" icon="pi pi-check" 
                  class="p-button-text" (click)="saveDonation()"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .donor-details {
      background: #ffffff;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .donor-details h2 {
      color: #1F2937;
      font-size: 1.5rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #22C55E;
      display: inline-block;
    }

    .donor-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-label {
      font-size: 0.875rem;
      color: #6B7280;
      font-weight: 500;
    }

    .info-value {
      font-size: 1rem;
      color: #1F2937;
      font-weight: 500;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      color: #1F2937;
      font-size: 1.875rem;
      margin: 0;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    :host ::ng-deep .p-button {
      border-radius: 8px;
    }

    :host ::ng-deep .p-button.p-button-success {
      background: #22C55E;
      border-color: #22C55E;
    }

    :host ::ng-deep .p-button.p-button-primary {
      background: #3B82F6;
      border-color: #3B82F6;
    }

    :host ::ng-deep .p-button.p-button-secondary {
      background: #6B7280;
      border-color: #6B7280;
    }

    .filter-section {
      margin-bottom: 2rem;
      position: relative;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .date-filters {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .p-inputgroup {
      width: 250px;
    }

    :host ::ng-deep .p-inputgroup .p-inputgroup-addon {
      background: #f8f9fa;
      border-right: none;
      color: #6c757d;
      font-weight: 500;
    }

    :host ::ng-deep .p-calendar {
      width: 100%;
    }

    :host ::ng-deep .p-calendar .p-inputtext {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .total-donations {
      background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      text-align: center;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
      transition: transform 0.3s ease;
    }

    .total-donations:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
    }

    .total-donations h2 {
      margin: 0;
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 500;
      letter-spacing: 1px;
    }

    .total-donations h1 {
      margin: 0.5rem 0 0 0;
      font-size: 2.5rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .donation-form .field {
      margin-bottom: 1rem;
    }

    .donation-form .field label {
      display: block;
      margin-bottom: 0.5rem;
    }

    .donation-form .field input,
    .donation-form .field p-dropdown {
      width: 100%;
    }

    .mr-2 {
      margin-right: 0.5rem;
    }

    .text-center {
      text-align: center;
    }
  `]
})
export class DonationHistoryComponent implements OnInit {
  donations: DonationDTO[] = [];
  filteredDonations: DonationDTO[] = [];
  donor: Donor | null = null;
  donationDialog: boolean = false;
  editMode: boolean = false;
  sendingEmail: boolean = false;
  emailDonationId: number | null = null;
  projects: CharityProject[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  totalAmount: number = 0;
  donationTypes: {label: string, value: string}[] = [
    {label: 'One Time', value: 'one-time'},
    {label: 'Monthly', value: 'monthly'}
  ];

  currentDonation: Donation = {
    amount: 0,
    dateDonation: new Date(),
    charityProject: null!,
    donor: null!,
    donationType: 'one-time'
  };

  constructor(
    private donationService: DonationService,
    private donorService: DonorService,
    private charityProjectService: CharityProjectService,
    private emailService: EmailService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const donorId = this.route.snapshot.params['id'];
    if (donorId) {
      this.loadDonorDetails(donorId);
      this.loadDonations(donorId);
      this.loadProjects();
    }
  }

  loadDonorDetails(donorId: number) {
    this.donorService.getDonorById(donorId).subscribe({
      next: (donor: Donor) => {
        this.donor = donor;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load donor details'
        });
      }
    });
  }

  loadDonations(donorId: number) {
    this.donationService.getDonationsByDonorId(donorId).subscribe({
      next: (donations: DonationDTO[]) => {
        this.donations = donations;
        this.filteredDonations = [...donations];
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load donations'
        });
      }
    });
  }

  loadProjects() {
    this.charityProjectService.getAllCharityProjects().subscribe({
      next: (projects: CharityProject[]) => {
        this.projects = projects;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load projects'
        });
      }
    });
  }

  onDateSelect() {
    if (this.startDate || this.endDate) {
      this.filteredDonations = this.donations.filter(donation => {
        const donationDate = new Date(donation.dateDonation);
        
        if (this.startDate && this.endDate) {
          return donationDate >= this.startDate && donationDate <= this.endDate;
        } else if (this.startDate) {
          return donationDate >= this.startDate;
        } else if (this.endDate) {
          return donationDate <= this.endDate;
        }
        
        return true;
      });
      
      this.calculateTotal();
    }
  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filteredDonations = [...this.donations];
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.filteredDonations.reduce((sum, donation) => 
      sum + donation.amount, 0);
  }

  openDonationDialog() {
    this.editMode = false;
    this.currentDonation = {
      amount: 0,
      dateDonation: new Date(),
      charityProject: null!,
      donor: this.donor!,
      donationType: 'one-time'
    };
    this.donationDialog = true;
  }

  editDonation(donation: DonationDTO) {
    this.editMode = true;
    this.currentDonation = {
      ...donation,
      dateDonation: new Date(donation.dateDonation)
    };
    this.donationDialog = true;
  }

  confirmDelete(donation: DonationDTO) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this donation?',
      accept: () => {
        this.deleteDonation(donation);
      }
    });
  }

  deleteDonation(donation: DonationDTO) {
    if (donation.id) {
      this.donationService.deleteDonation(donation.id).subscribe({
        next: () => {
          this.donations = this.donations.filter(d => d.id !== donation.id);
          this.filteredDonations = this.filteredDonations.filter(d => d.id !== donation.id);
          this.calculateTotal();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Donation deleted successfully'
          });
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete donation'
          });
        }
      });
    }
  }

  saveDonation() {
    if (!this.currentDonation.amount || !this.currentDonation.charityProject) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    const donationDTO: DonationDTO = {
      ...this.currentDonation,
      dateDonation: this.currentDonation.dateDonation.toISOString()
    };

    const operation = this.editMode && donationDTO.id
      ? this.donationService.updateDonation(donationDTO.id, this.currentDonation)
      : this.donationService.createDonation(this.currentDonation);

    operation.subscribe({
      next: (donation: Donation) => {
        const newDonationDTO: DonationDTO = {
          ...donation,
          dateDonation: donation.dateDonation.toISOString()
        };

        if (this.editMode) {
          const index = this.donations.findIndex(d => d.id === newDonationDTO.id);
          if (index !== -1) {
            this.donations[index] = newDonationDTO;
            this.onDateSelect(); // Reapply filters
          }
        } else {
          this.donations.unshift(newDonationDTO);
          this.onDateSelect(); // Reapply filters
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Donation ${this.editMode ? 'updated' : 'created'} successfully`
        });
        this.closeDonationDialog();
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.editMode ? 'update' : 'create'} donation`
        });
      }
    });
  }

  closeDonationDialog() {
    this.donationDialog = false;
    this.editMode = false;
    this.currentDonation = {
      amount: 0,
      dateDonation: new Date(),
      charityProject: null!,
      donor: null!,
      donationType: 'one-time'
    };
  }

  sendEmailReport() {
    if (!this.donor?.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Donor email address is not available'
      });
      return;
    }

    this.sendingEmail = true;
    const pdfBlob = this.emailService.generateDonationHistoryPDF(
      this.donor,
      this.filteredDonations,
      this.startDate || undefined,
      this.endDate || undefined
    );

    const formData = new FormData();
    formData.append('to', this.donor.email);
    formData.append('subject', 'Donation Report - Faseelah Charity');
    formData.append('body', `Dear ${this.donor.name},\n\nPlease find attached your donation report from Faseelah Charity.\n\nBest regards,\nFaseelah Charity`);
    formData.append('attachment', pdfBlob, 'donation-report.pdf');

    this.emailService.sendEmail(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Donation  report has been sent to your email'
        });
        this.sendingEmail = false;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send email'
        });
        this.sendingEmail = false;
      }
    });
  }

  sendSingleDonationEmail(donation: DonationDTO) {
    if (!this.donor?.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Donor email address is not available'
      });
      return;
    }

    this.sendingEmail = true;
    this.emailDonationId = donation.id!;

    // Create a Donation object with all required fields
    const fullDonation: Donation = {
      id: donation.id,
      amount: donation.amount,
      dateDonation: new Date(donation.dateDonation),
      donor: this.donor,
      charityProject: donation.charityProject,
      donationType: donation.donationType
    };
    
    const pdfBlob = this.emailService.generateTaxReceiptPDF(fullDonation);
    
    const formData = new FormData();
    formData.append('to', this.donor.email);
    formData.append('subject', `Tax Receipt for Your Donation to ${donation.charityProject.name}`);
    formData.append('body', `Dear ${this.donor.name},\n\nThank you for your generous donation of $${donation.amount.toFixed(2)} to ${donation.charityProject.name}. Please find attached your tax receipt for your records.\n\nBest regards,\nFaseelah Charity`);
    formData.append('attachment', pdfBlob, 'tax_receipt.pdf');

    this.emailService.sendEmail(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tax receipt has been sent to your email'
        });
        this.sendingEmail = false;
        this.emailDonationId = null;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send email'
        });
        this.sendingEmail = false;
        this.emailDonationId = null;
      }
    });
  }

  navigateBack() {
    this.router.navigate(['/donors']);
  }
}
