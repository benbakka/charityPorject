import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OrphanService } from '../../services/orphan.service';
import { Router } from '@angular/router';
import { CharityProjectService } from '../../services/charity-project.service';

@Component({
  selector: 'app-upload-charity-project',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="upload-container">
      <h2>Upload Excel File for Charity Projects</h2>
      <p-fileUpload
        [customUpload]="true"
        (uploadHandler)="onUpload($event)"
        accept=".xlsx,.xls"
        [maxFileSize]="1000000">
        <ng-template pTemplate="content">
          <p>Drag and drop Excel files here or click to upload.</p>
        </ng-template>
      </p-fileUpload>
    </div>
    <p-toast></p-toast>
  `,
  styles: [`
    .upload-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class UploadCharityProjectComponent {
  constructor(
    private router: Router,
    private messageService: MessageService,
    private charityProjectService: CharityProjectService
  ) {}

  onUpload(event: any) {
    const file = event.files[0];
    this.charityProjectService.uploadExcel(file).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/charity-projects']).then(() => {
            console.log('Navigation completed');
          }).catch(err => {
            console.error('Navigation failed:', err);
          });
        }, 1000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload file'
        });
      }
    });
  }
}