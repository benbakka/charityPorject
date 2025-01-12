import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="upload-container">
      <h2>Upload Excel File</h2>
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
export class UploadComponent {
  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  onUpload(event: any) {
    const file = event.files[0];
    this.userService.uploadExcel(file).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully'
        });
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