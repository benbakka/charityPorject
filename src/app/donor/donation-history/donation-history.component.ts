import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DonationService } from '../../services/donation.service';
import { DonationDTO } from '../../models/donation';
import { DonorService } from '../../services/donor.service';
import { EmailService } from '../../services/email.service';
import { HttpErrorResponse } from '@angular/common/http';

interface DonationHistory {
  amount: number;
  dateDonation: string;
  charityProjectName: string;
}

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CalendarModule,
    ToastModule,
    InputTextModule
  ],
  providers: [MessageService],
  template: `
    <div class="donation-history-container">
      <div class="header">
        <h1>Donation History</h1>
        <div class="header-actions">
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

      <div class="filter-section">
        <div class="date-filters">
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">From</span>
            <p-calendar [(ngModel)]="startDate" 
                      [showIcon]="true"
                      dateFormat="yy-mm-dd"
                      placeholder="Start date"
                      (onSelect)="onDateSelect()"></p-calendar>
          </div>
          <div class="p-inputgroup">
            <span class="p-inputgroup-addon">To</span>
            <p-calendar [(ngModel)]="endDate" 
                      [showIcon]="true"
                      dateFormat="yy-mm-dd"
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

      <p-table [value]="filteredDonations" 
               [tableStyle]="{'min-width': '50rem'}"
               [paginator]="true" 
               [rows]="10"
               [showCurrentPageReport]="true"
               [loading]="loading"
               styleClass="p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>DATE</th>
            <th>AMOUNT</th>
            <th>PROJECT</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-donation>
          <tr>
            <td>{{donation.dateDonation | date:'mediumDate'}}</td>
            <td>{{donation.amount | currency}}</td>
            <td>{{donation.charityProjectName}}</td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="3" class="text-center">No donations found</td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-toast></p-toast>
  `,
  styles: [`
    :host {
      display: block;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .donation-history-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .header h1 {
      margin: 0;
      color: #2c3344;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .header-actions button {
      transition: transform 0.2s;
    }

    .header-actions button:hover {
      transform: translateY(-1px);
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

    :host ::ng-deep .p-button.p-button-text {
      color: #6c757d;
    }

    :host ::ng-deep .p-button.p-button-text:hover {
      background: rgba(108, 117, 125, 0.04);
      color: #495057;
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

    :host ::ng-deep .p-datatable {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    :host ::ng-deep .p-datatable .p-datatable-header {
      background: white;
      padding: 1.25rem;
      border-bottom: 1px solid #f0f0f0;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: white;
      color: #2c3344;
      font-weight: 600;
      padding: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      transition: background-color 0.2s;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f8f9fa;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:nth-child(even) {
      background: #fafbfc;
    }

    :host ::ng-deep .p-toast .p-toast-message {
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .text-center {
      text-align: center;
    }

    @media (max-width: 768px) {
      .donation-history-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .header-actions {
        width: 100%;
        justify-content: center;
      }

      .date-filters {
        flex-direction: column;
        gap: 1rem;
      }

      .p-inputgroup {
        width: 100%;
      }

      :host ::ng-deep .p-button.p-button-text {
        align-self: flex-end;
      }

      .total-donations h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class DonationHistoryComponent implements OnInit {
  donationHistory: DonationHistory[] = [];
  filteredDonations: DonationHistory[] = [];
  loading = false;
  totalAmount = 0;
  startDate: Date | null = null;
  endDate: Date | null = null;
  sendingEmail = false;
  donor: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donorService: DonorService,
    private donationService: DonationService,
    private emailService: EmailService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const donorId = this.route.snapshot.params['id'];
    if (donorId) {
      this.loadDonor(donorId);
      this.loadDonationHistory(donorId);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid donor ID'
      });
      this.navigateBack();
    }
  }

  loadDonor(donorId: number) {
    this.donorService.getDonorById(donorId).subscribe({
      next: (donor) => {
        this.donor = donor;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load donor information'
        });
      }
    });
  }

  loadDonationHistory(donorId: number) {
    this.loading = true;
    this.donationService.getDonationHistory(donorId).subscribe({
      next: (donations) => {
        this.donationHistory = donations.map(donation => ({
          amount: donation.amount,
          dateDonation: donation.dateDonation,
          charityProjectName: donation.charityProject.name
        }));
        this.filteredDonations = [...this.donationHistory];
        this.calculateTotal();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load donation history'
        });
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    this.totalAmount = this.filteredDonations.reduce((sum, donation) => 
      sum + donation.amount, 0);
  }

  onDateSelect() {
    if (this.startDate || this.endDate) {
      this.filteredDonations = this.donationHistory.filter(donation => {
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
    this.filteredDonations = [...this.donationHistory];
    this.calculateTotal();
  }

  navigateBack() {
    this.router.navigate(['/donors']);
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
    formData.append('subject', 'Donation History Report - Faseelah Charity');
    formData.append('body', `Dear ${this.donor.name},\n\nPlease find attached your donation history report from Faseelah Charity.\n\nBest regards,\nFaseelah Charity`);
    formData.append('attachment', pdfBlob, 'donation-history.pdf');

    this.emailService.sendEmail(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Donation history report has been sent to your email'
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
}
