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
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrphanIDCard } from '../models/orphan-idcard';
import { OrphanService } from '../services/orphan.service';

interface Country {
  name: string;
  code: string;
  abbreviation: string;
}

@Component({
  selector: 'app-orphan-id-card',
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
    CalendarModule,
    DropdownModule,
    InputTextareaModule,
    InputNumberModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './orphan-id-card.component.html',
  styleUrls: ['./orphan-id-card.component.css'],
  styles: [`
    :host {
      display: block;
      padding: 2rem;
    }

    .orphan-container {
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

    .orphan-form {
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

    :host ::ng-deep .p-toast {
      opacity: 1 !important;
      position: fixed;
      top: 20px;
      right: 20px;
    }

    :host ::ng-deep .p-toast .p-toast-message {
      margin: 0;
      box-shadow: none;
      border-radius: 6px;
      padding: 1rem;
      background: #ECFDF5 !important;
      border: none;
      color: #065F46;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
      min-height: 48px;
    }

    :host ::ng-deep .p-toast .p-toast-message-content {
      padding: 0;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 6px;
      min-height: 24px;
    }

    :host ::ng-deep .p-toast .p-toast-message::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6px;
      background: #10B981;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    :host ::ng-deep .p-toast .p-toast-message-content {
      padding: 0;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 6px;
    }

    :host ::ng-deep .p-toast .p-toast-message-icon {
      font-size: 1.2rem;
      margin-right: 0;
    }

    :host ::ng-deep .p-toast .p-toast-summary {
      font-weight: 600;
      font-size: 16px;
      color: #10B981;
      margin: 0;
      line-height: 1.5;
    }

    :host ::ng-deep .p-toast .p-toast-detail {
      margin: 0;
      padding: 0;
      font-size: 14px;
      color: #34D399;
      line-height: 1.5;
    }

    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-summary {
      color: #EF4444;
    }

    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-detail {
      color: #F87171;
    }

    :host ::ng-deep .p-toast .p-toast-icon-close {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #065F46;
      border-radius: 4px;
    }

    :host ::ng-deep .p-toast .p-toast-icon-close:hover {
      background: rgba(6, 95, 70, 0.1);
    }

    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error {
      background: #FEF2F2 !important;
      color: #991B1B;
    }

    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error::before {
      background: #EF4444;
    }

    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-message-icon,
    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-summary,
    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-detail,
    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-icon-close {
      color: #991B1B;
    }

    :host ::ng-deep .p-toast .p-toast-message.p-toast-message-error .p-toast-icon-close:hover {
      background: rgba(153, 27, 27, 0.1);
    }
  `],
})
export class OrphanIDCardComponent implements OnInit {
  orphans: OrphanIDCard[] = [];
  selectedOrphan: OrphanIDCard = this.getEmptyOrphan();
  displayDialog = false;
  dialogHeader = '';
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  nameFilter = '';
  idFilter = '';
  ageFilter: number | null = null;
  countryFilter: string | null = null;
  filteredOrphans: OrphanIDCard[] = [];
  showPhotoDialog = false;
  selectedPhotoUrl: string = '';

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  countries: Country[] = [
    { name: 'Algeria', code: 'DZ', abbreviation: 'DZA' },
    { name: 'Angola', code: 'AO', abbreviation: 'AGO' },
    { name: 'Benin', code: 'BJ', abbreviation: 'BEN' },
    { name: 'Botswana', code: 'BW', abbreviation: 'BWA' },
    { name: 'Burkina Faso', code: 'BF', abbreviation: 'BFA' },
    { name: 'Burundi', code: 'BI', abbreviation: 'BDI' },
    { name: 'Cabo Verde', code: 'CV', abbreviation: 'CPV' },
    { name: 'Cameroon', code: 'CM', abbreviation: 'CMR' },
    { name: 'Central African Republic', code: 'CF', abbreviation: 'CAF' },
    { name: 'Chad', code: 'TD', abbreviation: 'TCD' },
    { name: 'Comoros', code: 'KM', abbreviation: 'COM' },
    { name: 'Congo (Congo-Brazzaville)', code: 'CG', abbreviation: 'COG' },
    { name: 'Congo (Congo-Kinshasa)', code: 'CD', abbreviation: 'COD' },
    { name: 'Djibouti', code: 'DJ', abbreviation: 'DJI' },
    { name: 'Egypt', code: 'EG', abbreviation: 'EGY' },
    { name: 'Equatorial Guinea', code: 'GQ', abbreviation: 'GNQ' },
    { name: 'Eritrea', code: 'ER', abbreviation: 'ERI' },
    { name: 'Eswatini (Swaziland)', code: 'SZ', abbreviation: 'SWZ' },
    { name: 'Ethiopia', code: 'ET', abbreviation: 'ETH' },
    { name: 'Gabon', code: 'GA', abbreviation: 'GAB' },
    { name: 'Gambia', code: 'GM', abbreviation: 'GMB' },
    { name: 'Ghana', code: 'GH', abbreviation: 'GHA' },
    { name: 'Guinea', code: 'GN', abbreviation: 'GIN' },
    { name: 'Guinea-Bissau', code: 'GW', abbreviation: 'GNB' },
    { name: 'Ivory Coast (Côte d\'Ivoire)', code: 'CI', abbreviation: 'CIV' },
    { name: 'Kenya', code: 'KE', abbreviation: 'KEN' },
    { name: 'Lesotho', code: 'LS', abbreviation: 'LSO' },
    { name: 'Liberia', code: 'LR', abbreviation: 'LBR' },
    { name: 'Libya', code: 'LY', abbreviation: 'LBY' },
    { name: 'Madagascar', code: 'MG', abbreviation: 'MDG' },
    { name: 'Malawi', code: 'MW', abbreviation: 'MWI' },
    { name: 'Mali', code: 'ML', abbreviation: 'MLI' },
    { name: 'Mauritania', code: 'MR', abbreviation: 'MRT' },
    { name: 'Mauritius', code: 'MU', abbreviation: 'MUS' },
    { name: 'Morocco', code: 'MA', abbreviation: 'MAR' },
    { name: 'Mozambique', code: 'MZ', abbreviation: 'MOZ' },
    { name: 'Namibia', code: 'NA', abbreviation: 'NAM' },
    { name: 'Niger', code: 'NE', abbreviation: 'NER' },
    { name: 'Nigeria', code: 'NG', abbreviation: 'NGA' },
    { name: 'Rwanda', code: 'RW', abbreviation: 'RWA' },
    { name: 'Sao Tome and Principe', code: 'ST', abbreviation: 'STP' },
    { name: 'Senegal', code: 'SN', abbreviation: 'SEN' },
    { name: 'Seychelles', code: 'SC', abbreviation: 'SYC' },
    { name: 'Sierra Leone', code: 'SL', abbreviation: 'SLE' },
    { name: 'Somalia', code: 'SO', abbreviation: 'SOM' },
    { name: 'South Africa', code: 'ZA', abbreviation: 'ZAF' },
    { name: 'South Sudan', code: 'SS', abbreviation: 'SSD' },
    { name: 'Sudan', code: 'SD', abbreviation: 'SDN' },
    { name: 'Tanzania', code: 'TZ', abbreviation: 'TZA' },
    { name: 'Togo', code: 'TG', abbreviation: 'TGO' },
    { name: 'Tunisia', code: 'TN', abbreviation: 'TUN' },
    { name: 'Uganda', code: 'UG', abbreviation: 'UGA' },
    { name: 'Zambia', code: 'ZM', abbreviation: 'ZMB' },
    { name: 'Zimbabwe', code: 'ZW', abbreviation: 'ZWE' },
  ];

  constructor(
    private orphanService: OrphanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadOrphans();
  }

  getEmptyOrphan(): OrphanIDCard {
    return {
      id: 0,
      orphanId: '',
      photo: '',
      firstName: '',
      lastName: '',
      dob: null,
      placeOfBirth: '',
      gender: '',
      location: '',
      country: '',
      healthStatus: '',
      specialNeeds: '',
      familyInformation: {
        ethnicGroup: '',
        spokenLanguage: '',
        fatherName: '',
        fatherDateOfDeath: null,
        fatherCauseOfDeath: '',
        motherName: '',
        motherStatus: '',
        motherDateOfDeath: null,
        motherCauseOfDeath: '',
        numberOfSiblings: 0,
        guardianName: '',
        relationToOrphan: '',
        livingCondition: ''
      },
      education: {
        schoolName: '',
        gradeLevel: '',
        favoriteSubject: '',
        educationNeeds: '',
        schoolPerformance: '',
        orphanDream: '',
        favoriteHobbies: '',
        supervisorComments: ''
      }
    };
  }

  calculateAge(dob: Date | null): number {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  loadOrphans() {
    this.orphanService.getOrphans().subscribe((orphans) => {
      this.orphans = orphans;
      this.applyFilters();
    });
  }

  generateOrphanId(): void {
    const country = this.selectedOrphan.country;
    if (!country) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a country first.',
        life: 3000
      });
      return;
    }

    this.orphanService.getLastOrphanId(country).subscribe({
      next: (lastId: string) => {
        let number = 1;
        if (lastId) {
          // Extract the number from the ID and increment it
          const match = lastId.match(/[A-Z]+(\d+)/);
          if (match && match[1]) {
            number = parseInt(match[1]) + 1;
          }
        }
        // Format the new ID with the country code and padded number
        this.selectedOrphan.orphanId = `${country}${String(number).padStart(3, '0')}`;
      },
      error: (error) => {
        console.error('Error generating orphan ID:', error);
        // If we get a 404 (not found), it means this is the first orphan for this country
        if (error.status === 404) {
          this.selectedOrphan.orphanId = `${country}001`;
          return;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate orphan ID. Please try again.',
          life: 3000
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  applyFilters() {
    this.filteredOrphans = this.orphans.filter(orphan => {
      const nameMatch = !this.nameFilter || 
        (orphan.firstName + ' ' + orphan.lastName)
          .toLowerCase()
          .includes(this.nameFilter.toLowerCase());
      
      const idMatch = !this.idFilter || 
        orphan.orphanId.toLowerCase().includes(this.idFilter.toLowerCase());
      
      const ageMatch = !this.ageFilter || 
        this.calculateAge(orphan.dob) === this.ageFilter;

      const countryMatch = !this.countryFilter || 
        orphan.country === this.countryFilter;

      return nameMatch && idMatch && ageMatch && countryMatch;
    });
  }

  clearFilters() {
    this.nameFilter = '';
    this.idFilter = '';
    this.ageFilter = null;
    this.countryFilter = null;
    this.applyFilters();
  }

  getCountryName(countryCode: string): string {
    const country = this.countries.find(c => c.abbreviation === countryCode);
    return country ? country.name : countryCode;
  }

  showAddDialog(): void {
    this.selectedOrphan = this.getEmptyOrphan();
    this.photoPreview = null;
    this.selectedFile = null;
    this.displayDialog = true;
    this.dialogHeader = 'Add New Orphan';
  }

  editOrphan(orphan: OrphanIDCard): void {
    this.selectedOrphan = { 
      ...orphan,
      dob: orphan.dob ? new Date(orphan.dob) : null,
      familyInformation: {
        ...orphan.familyInformation,
        fatherDateOfDeath: orphan.familyInformation.fatherDateOfDeath ? new Date(orphan.familyInformation.fatherDateOfDeath) : null,
        motherDateOfDeath: orphan.familyInformation.motherDateOfDeath ? new Date(orphan.familyInformation.motherDateOfDeath) : null
      }
    };
    this.photoPreview = orphan.photo;
    this.selectedFile = null;
    this.dialogHeader = 'Edit Orphan';
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
  }

  saveOrphan(): void {
    if (!this.selectedOrphan.country) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a country first.',
        life: 3000
      });
      return;
    }
  
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }
    
    formData.append(
      'OrphanIDCard',
      new Blob([JSON.stringify(this.selectedOrphan)], { type: 'application/json' })
    );
  
    const request$ = this.selectedOrphan.id
      ? this.orphanService.updateOrphanWithPhoto(this.selectedOrphan.id, formData)
      : this.orphanService.addOrphanWithPhoto(formData);
  
    request$.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: this.selectedOrphan.id ? 'Orphan Updated' : 'Orphan Created',
          life: 3000
        });
        this.loadOrphans();
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error saving orphan:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save orphan. Please try again.',
          life: 3000
        });
      }
    });
  }

  deleteOrphan(orphan: OrphanIDCard) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this orphan?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (orphan.id) {
          this.orphanService.deleteOrphan(orphan.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Orphan Deleted',
                life: 3000
              });
              this.loadOrphans();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete orphan',
                life: 3000
              });
            }
          });
        }
      }
    });
  }

  deleteAll() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all orphans?',
      header: 'Confirm Delete All',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orphanService.deleteAllOrphans().subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'All Orphans Deleted',
              life: 3000
            });
            this.loadOrphans();
          },
          error: (error: Error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete all orphans',
              life: 3000
            });
          }
        });
      }
    });
  }

  openPhotoPreview(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
    this.showPhotoDialog = true;
  }
}