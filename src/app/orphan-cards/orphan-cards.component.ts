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
import { PdfService } from '../services/pdf.service';

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
  templateUrl: './orphan-cards.component.html',
  styleUrl: './orphan-cards.component.css',
  providers: [MessageService, ConfirmationService]

})
export class OrphanCardsComponent {

  orphans: OrphanIDCard[] = [];
  selectedOrphan: OrphanIDCard = this.getEmptyOrphan();
  displayDialog = false;
  dialogHeader = '';
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  nameFilter = '';
  idFilter = '';
  countryFilter = '';
  filteredOrphans: OrphanIDCard[] = [];
  showPhotoDialog = false;
  selectedPhotoUrl: string = '';

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  countries = [
    { name: 'Algeria', abbreviation: 'DZA' },
    { name: 'Angola', abbreviation: 'AGO' },
    { name: 'Benin', abbreviation: 'BEN' },
    { name: 'Botswana', abbreviation: 'BWA' },
    { name: 'Burkina Faso', abbreviation: 'BFA' },
    { name: 'Burundi', abbreviation: 'BDI' },
    { name: 'Cabo Verde', abbreviation: 'CPV' },
    { name: 'Cameroon', abbreviation: 'CMR' },
    { name: 'Central African Republic', abbreviation: 'CAF' },
    { name: 'Chad', abbreviation: 'TCD' },
    { name: 'Comoros', abbreviation: 'COM' },
    { name: 'Congo (Congo-Brazzaville)', abbreviation: 'COG' },
    { name: 'Congo (Congo-Kinshasa)', abbreviation: 'COD' },
    { name: 'Djibouti', abbreviation: 'DJI' },
    { name: 'Egypt', abbreviation: 'EGY' },
    { name: 'Equatorial Guinea', abbreviation: 'GNQ' },
    { name: 'Eritrea', abbreviation: 'ERI' },
    { name: 'Eswatini (Swaziland)', abbreviation: 'SWZ' },
    { name: 'Ethiopia', abbreviation: 'ETH' },
    { name: 'Gabon', abbreviation: 'GAB' },
    { name: 'Gambia', abbreviation: 'GMB' },
    { name: 'Ghana', abbreviation: 'GHA' },
    { name: 'Guinea', abbreviation: 'GIN' },
    { name: 'Guinea-Bissau', abbreviation: 'GNB' },
    { name: 'Ivory Coast (Côte d\'Ivoire)', abbreviation: 'CIV' },
    { name: 'Kenya', abbreviation: 'KEN' },
    { name: 'Lesotho', abbreviation: 'LSO' },
    { name: 'Liberia', abbreviation: 'LBR' },
    { name: 'Libya', abbreviation: 'LBY' },
    { name: 'Madagascar', abbreviation: 'MDG' },
    { name: 'Malawi', abbreviation: 'MWI' },
    { name: 'Mali', abbreviation: 'MLI' },
    { name: 'Mauritania', abbreviation: 'MRT' },
    { name: 'Mauritius', abbreviation: 'MUS' },
    { name: 'Morocco', abbreviation: 'MAR' },
    { name: 'Mozambique', abbreviation: 'MOZ' },
    { name: 'Namibia', abbreviation: 'NAM' },
    { name: 'Niger', abbreviation: 'NER' },
    { name: 'Nigeria', abbreviation: 'NGA' },
    { name: 'Rwanda', abbreviation: 'RWA' },
    { name: 'Sao Tome and Principe', abbreviation: 'STP' },
    { name: 'Senegal', abbreviation: 'SEN' },
    { name: 'Seychelles', abbreviation: 'SYC' },
    { name: 'Sierra Leone', abbreviation: 'SLE' },
    { name: 'Somalia', abbreviation: 'SOM' },
    { name: 'South Africa', abbreviation: 'ZAF' },
    { name: 'South Sudan', abbreviation: 'SSD' },
    { name: 'Sudan', abbreviation: 'SDN' },
    { name: 'Tanzania', abbreviation: 'TZA' },
    { name: 'Togo', abbreviation: 'TGO' },
    { name: 'Tunisia', abbreviation: 'TUN' },
    { name: 'Uganda', abbreviation: 'UGA' },
    { name: 'Zambia', abbreviation: 'ZMB' },
    { name: 'Zimbabwe', abbreviation: 'ZWE' },
  ];

  constructor(
    private pdfService: PdfService,
    private orphanService: OrphanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadOrphans();
    this.countries = [
      { name: 'Algeria', abbreviation: 'DZA' },
    { name: 'Angola', abbreviation: 'AGO' },
    { name: 'Benin', abbreviation: 'BEN' },
    { name: 'Botswana', abbreviation: 'BWA' },
    { name: 'Burkina Faso', abbreviation: 'BFA' },
    { name: 'Burundi', abbreviation: 'BDI' },
    { name: 'Cabo Verde', abbreviation: 'CPV' },
    { name: 'Cameroon', abbreviation: 'CMR' },
    { name: 'Central African Republic', abbreviation: 'CAF' },
    { name: 'Chad', abbreviation: 'TCD' },
    { name: 'Comoros', abbreviation: 'COM' },
    { name: 'Congo (Congo-Brazzaville)', abbreviation: 'COG' },
    { name: 'Congo (Congo-Kinshasa)', abbreviation: 'COD' },
    { name: 'Djibouti', abbreviation: 'DJI' },
    { name: 'Egypt', abbreviation: 'EGY' },
    { name: 'Equatorial Guinea', abbreviation: 'GNQ' },
    { name: 'Eritrea', abbreviation: 'ERI' },
    { name: 'Eswatini (Swaziland)', abbreviation: 'SWZ' },
    { name: 'Ethiopia', abbreviation: 'ETH' },
    { name: 'Gabon', abbreviation: 'GAB' },
    { name: 'Gambia', abbreviation: 'GMB' },
    { name: 'Ghana', abbreviation: 'GHA' },
    { name: 'Guinea', abbreviation: 'GIN' },
    { name: 'Guinea-Bissau', abbreviation: 'GNB' },
    { name: 'Ivory Coast (Côte d\'Ivoire)', abbreviation: 'CIV' },
    { name: 'Kenya', abbreviation: 'KEN' },
    { name: 'Lesotho', abbreviation: 'LSO' },
    { name: 'Liberia', abbreviation: 'LBR' },
    { name: 'Libya', abbreviation: 'LBY' },
    { name: 'Madagascar', abbreviation: 'MDG' },
    { name: 'Malawi', abbreviation: 'MWI' },
    { name: 'Mali', abbreviation: 'MLI' },
    { name: 'Mauritania', abbreviation: 'MRT' },
    { name: 'Mauritius', abbreviation: 'MUS' },
    { name: 'Morocco', abbreviation: 'MAR' },
    { name: 'Mozambique', abbreviation: 'MOZ' },
    { name: 'Namibia', abbreviation: 'NAM' },
    { name: 'Niger', abbreviation: 'NER' },
    { name: 'Nigeria', abbreviation: 'NGA' },
    { name: 'Rwanda', abbreviation: 'RWA' },
    { name: 'Sao Tome and Principe', abbreviation: 'STP' },
    { name: 'Senegal', abbreviation: 'SEN' },
    { name: 'Seychelles', abbreviation: 'SYC' },
    { name: 'Sierra Leone', abbreviation: 'SLE' },
    { name: 'Somalia', abbreviation: 'SOM' },
    { name: 'South Africa', abbreviation: 'ZAF' },
    { name: 'South Sudan', abbreviation: 'SSD' },
    { name: 'Sudan', abbreviation: 'SDN' },
    { name: 'Tanzania', abbreviation: 'TZA' },
    { name: 'Togo', abbreviation: 'TGO' },
    { name: 'Tunisia', abbreviation: 'TUN' },
    { name: 'Uganda', abbreviation: 'UGA' },
    { name: 'Zambia', abbreviation: 'ZMB' },
    { name: 'Zimbabwe', abbreviation: 'ZWE' },
    ];
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
      this.filteredOrphans = [...orphans];
    });
  }

  generateOrphanId(): void {
    const country = this.selectedOrphan.country;
    if (country) {
      this.orphanService.getLastOrphanId(country).subscribe(
        (lastId: string) => {
          const number = lastId ? parseInt(lastId.slice(3)) + 1 : 1;
          const formattedId = `${country}${String(number).padStart(3, '0')}`;
          this.selectedOrphan.orphanId = formattedId;
        },
        (error) => console.error('Error generating orphan ID:', error)
      );
    }
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
    this.filteredOrphans = this.orphans.filter((orphan) => {
      const fullName = `${orphan.firstName} ${orphan.lastName}`.toLowerCase();
      const orphanId = orphan.orphanId ? orphan.orphanId.toLowerCase() : '';
      const searchId = this.idFilter ? this.idFilter.toLowerCase() : '';

      return (
        (!this.nameFilter || fullName.includes(this.nameFilter.toLowerCase())) &&
        (!this.idFilter || orphanId.includes(searchId)) &&
        (!this.countryFilter || this.countryFilter === 'all' || orphan.country === this.countryFilter)
      );
    });
  }

  getCountryName(abbreviation: string): string {
    const country = this.countries.find(c => c.abbreviation === abbreviation);
    return country ? country.name : abbreviation;
  }

  showAddDialog(): void {
    this.selectedOrphan = this.getEmptyOrphan();
    this.photoPreview = null;
    this.selectedFile = null;
    this.displayDialog = true;
    this.dialogHeader = 'Add New Orphan';
  }

  editOrphan(orphan: OrphanIDCard): void {
    this.selectedOrphan = { ...orphan };
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
      alert('Please select a country.');
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    // Ensure the key matches the backend expectation
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
          summary: 'Success',
          detail: response.message
        });
        this.loadOrphans();
        this.hideDialog();
      },
      error: (error) => {
        console.error('Error saving orphan:', error);
        if (error.status === 400) {
          alert('There was an issue with your input. Please check all fields.');
        }
      }
    });
  }

  deleteOrphan(orphan: OrphanIDCard) {
    if (orphan.id != null) { // Ensure id is not null or undefined
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this orphan?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.orphanService.deleteOrphan(orphan.id!).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Orphan deleted successfully',
              });
              this.loadOrphans();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete orphan',
              });
            },
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Cancelled',
            detail: 'Orphan deletion cancelled',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Orphan',
        detail: 'Unable to delete orphan. ID is missing.',
      });
    }
  }

  deleteAll() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all orphans? This action cannot be undone.',
      header: 'Confirm Mass Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.orphans.length === 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'No Orphans',
            detail: 'There are no orphans to delete.'
          });
          return;
        }

        const deletionPromises = this.orphans
          .filter(orphan => orphan.id)
          .map(orphan => this.orphanService.deleteOrphan(orphan.id));

        if (deletionPromises.length > 0) {
          import('rxjs').then(rxjs => {
            rxjs.forkJoin(deletionPromises).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'All orphans have been deleted successfully'
                });
                this.loadOrphans();
              },
              error: (error) => {
                console.error('Error deleting orphans:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to delete all orphans'
                });
              }
            });
          });
        }
      }
    });
  }

  openPhotoPreview(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
    this.showPhotoDialog = true;
  }

  async downloadCard(orphan: OrphanIDCard) {
    try {
      const templateElement = document.createElement('div');
      templateElement.style.width = '210mm'; // A5 width
      templateElement.style.height = '297mm'; // A5 height
      templateElement.style.position = 'absolute';
      templateElement.style.top = '-10000px'; // Move far above the visible area
      templateElement.style.left = '-10000px'; // Move far to the left
      templateElement.innerHTML = this.createCardTemplate(orphan);

      // Append the template to the body
      document.body.appendChild(templateElement);

      // Ensure the image is fully loaded before proceeding
      const img = new Image();
      img.src = orphan.photo;
      img.onload = async () => {
        // Generate the A5-sized PDF
        await this.pdfService.generateUserCard(orphan, templateElement);

        // Remove the template from the DOM
        document.body.removeChild(templateElement);

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Card downloaded successfully',
        });
      };
      img.onerror = (error) => {
        console.error('Image load error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load image',
        });
      };
    } catch (error) {
      // Show error message
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download card',
      });
    }
  }

  async downloadCard1(orphan: OrphanIDCard) {
    try {
      const templateElement = document.createElement('div');
      templateElement.style.width = '210mm'; // A5 width
      templateElement.style.height = '297mm'; // A5 height
      templateElement.style.position = 'absolute';
      templateElement.style.top = '-10000px'; // Move far above the visible area
      templateElement.style.left = '-10000px'; // Move far to the left
      templateElement.innerHTML = this.createCardTemplate1(orphan);

      // Append the template to the body
      document.body.appendChild(templateElement);

      // Ensure the image is fully loaded before proceeding
      const img = new Image();
      img.src = orphan.photo;
      img.onload = async () => {
        // Generate the A5-sized PDF
        await this.pdfService.generateUserCard1(orphan, templateElement);

        // Remove the template from the DOM
        document.body.removeChild(templateElement);

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Card downloaded successfully',
        });
      };
      img.onerror = (error) => {
        console.error('Image load error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load image',
        });
      };
    } catch (error) {
      // Show error message
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download card',
      });
    }
  }

  downloadAllCards() {
    this.orphans.forEach(orphan => {
      this.downloadCard(orphan);
    });
  }

  downloadAllCards1() {
    this.orphans.forEach(orphan => {
      this.downloadCard1(orphan);
    });
  }

  private createCardTemplate(orphan: OrphanIDCard): string {
    return `
      <div style="
        width: 210mm;
        height: 297mm;
        background-size: cover;
        background-position: center;
        position: relative;
        font-family: 'El Messiri', sans-serif; /* Apply the font here */
      ">
        <!-- User Image -->
        <div style="
          position: absolute;
          top: 53.5%; 
          left: 20.7%; 
          transform: translate(-50%, -50%);
          width: 225px; 
          height: 274px; 
        ">
          <img src="${orphan.photo}" alt="User Photo" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 30px;
          ">
        </div>
    
        <!-- Attributes -->
        <h1 style="
          font-size: 26px; 
          position: absolute; 
          bottom: 33.6%; 
          left: 86%; 
          transform: translate(-50%, -50%); 
          color: black; 
          font-weight: bold; 
          letter-spacing: 0.9px; 
          width: 300px; /* Fixed width */
          text-align: left; /* Align text to the left */
          white-space: nowrap; /* Prevent text wrapping */
          overflow: hidden; /* Hide overflow text */
          text-overflow: ellipsis; /* Show ellipsis for overflow */
        ">
          ${orphan.orphanId}
        </h1>
  
        <h1 style="
          font-size: 26px; 
          position: absolute; 
          bottom: 25.1%; 
          left: 53.9%; 
          transform: translate(-50%, -50%); 
          color: black; 
          font-weight: bold; 
          letter-spacing: 0.9px; 
          width: 300px; /* Fixed width */
          text-align: left; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
        ">
          ${orphan.firstName}${orphan.lastName}
        </h1>
  
        <h1 style="
          font-size: 26px; 
          position: absolute; 
          bottom: 22.2%; 
          left: 53.9%; 
          transform: translate(-50%, -50%); 
          color: black; 
          font-weight: bold; 
          letter-spacing: 0.9px; 
          width: 300px; /* Fixed width */
          text-align: left; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
        ">
          ${this.calculateAge(orphan.dob)} years old 
        </h1>
  
        <h1 style="
          font-size: 26px; 
          position: absolute; 
          bottom: 18.96%; 
          left: 53.9%; 
          transform: translate(-50%, -50%); 
          color: black; 
          font-weight: bold; 
          letter-spacing: 0.9px; 
          width: 300px; /* Fixed width */
          text-align: left; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
        ">
          ${orphan.education.gradeLevel} Grade
        </h1>
  
        <h1 style="
          font-size: 26px; 
          position: absolute; 
          bottom: 16%; 
          left: 60.2%; 
          transform: translate(-50%, -50%); 
          color: black; 
          font-weight: bold; 
          letter-spacing: 0.9px; 
          width: 400px; /* Fixed width */
          text-align: left; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis;
        ">
          ${orphan.location},${this.getCountryName(orphan.country)}
        </h1>
      </div>
    `;
  }

  private createCardTemplate1(orphan: OrphanIDCard): string {
      return `
        <div style="
          width: 210mm;
          height: 297mm;
          background-size: cover;
          background-position: center;
          position: relative;
          font-family: 'El Messiri', sans-serif; /* Apply the font here */
        ">
          <!-- User Image -->
          <div style="
            position: absolute;
            top: 65.24%; 
            left: 20.74%; 
            transform: translate(-50%, -50%);
            width: 219px; 
            height: 253px; 
          ">
                  <img src="${orphan.photo}" alt="User Photo" style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 55px;
            ">
          </div>
          <!-- Attributes -->
          <h1 style="
            font-size: 26px; 
            position: absolute; 
            bottom: 32.2%; 
            left: 94%; 
            transform: translate(-50%, -50%); 
            color: black; 
            font-weight: bold; 
            letter-spacing: 0.9px; 
            width: 300px; /* Fixed width */
            text-align: left; /* Align text to the left */
            white-space: nowrap; /* Prevent text wrapping */
            overflow: hidden; /* Hide overflow text */
            text-overflow: ellipsis; /* Show ellipsis for overflow */
          ">
            ${orphan.orphanId}
          </h1>
    
          <h1 style="
            font-size: 24px; 
            position: absolute; 
            bottom: 26.8%; 
            left: 72.9%; 
            transform: translate(-50%, -50%); 
            color: black; 
            font-weight: bold; 
            letter-spacing: 0.9px; 
            width: 300px; /* Fixed width */
            text-align: left; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
          ">
            ${orphan.firstName}${orphan.lastName}

          </h1>
    
          <h1 style="
            font-size: 24px; 
            position: absolute; 
            bottom: 23.76%; 
            left: 72.95%; 
            transform: translate(-50%, -50%); 
            color: black; 
            font-weight: bold; 
            letter-spacing: 0.9px; 
            width: 300px; /* Fixed width */
            text-align: left; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
          ">
            ${this.calculateAge(orphan.dob)} years old
          </h1>
    
          <h1 style="
            font-size: 24px; 
            position: absolute; 
            bottom: 20.94%; 
            left: 73.1%; 
            transform: translate(-50%, -50%); 
            color: black; 
            font-weight: bold; 
            letter-spacing: 0.9px; 
            width: 300px; /* Fixed width */
            text-align: left; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
          ">
            ${orphan.education.gradeLevel} Grade
          </h1>
    
          <h1 style="
            font-size: 24px; 
            position: absolute; 
            bottom: 17.9%; 
            left: 81.9%; 
            transform: translate(-50%, -50%); 
            color: black; 
            font-weight: bold; 
            letter-spacing: 0.9px; 
            width: 300px; /* Fixed width */
            text-align: left; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
          ">
            ${orphan.location},${this.getCountryName(orphan.country)}
          </h1>
        </div>
      `;
  }
}
