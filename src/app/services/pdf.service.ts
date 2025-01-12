import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';
import { OrphanIDCard } from '../models/orphan-idcard';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private imageProxyService: UserService) {}

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async generateUserCard(orphan: OrphanIDCard, element: HTMLElement): Promise<void> {
    try {
      // Handle the orphan's photo
      const imgElement = element.querySelector('img') as HTMLImageElement;
      if (imgElement) {
        if (orphan.photo.startsWith('data:') || orphan.photo.startsWith('/')) {
          imgElement.src = orphan.photo;
        } else {
          try {
            const proxiedImageResponse = await firstValueFrom(
              this.imageProxyService.getProxiedImage(orphan.photo)
            );
            imgElement.src = proxiedImageResponse.data;
          } catch (error) {
            console.error('Error proxying image:', error);
            imgElement.src = orphan.photo;
          }
        }

        // Wait for the image to load
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });
      }

      // Create PDF with A5 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      // Load and add the background image first
      try {
        const backgroundImage = await this.loadImage('/assets/orphanCard.jpg');
        const imgWidth = 148; // A5 width in mm
        const imgHeight = 210; // A5 height in mm
        pdf.addImage(backgroundImage, 'JPEG', 0, 0, imgWidth, imgHeight);
      } catch (error) {
        console.error('Error loading background image:', error);
      }

      // Render the content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null // Transparent background
      });

      // Add the content overlay
      const imgWidth = 148; // A5 width in mm
      const imgHeight = 210; // A5 height in mm
      const canvasDataURL = canvas.toDataURL('image/png');
      pdf.addImage(canvasDataURL, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      const fileName = `${orphan.lastName.toLowerCase().replace(/\s+/g, '-')}-card.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please make sure all images are accessible and try again.');
    }
  }

  async generateUserCard1(orphan: OrphanIDCard, element: HTMLElement): Promise<void> {
    try {
      // Handle the orphan's photo
      const imgElement = element.querySelector('img') as HTMLImageElement;
      if (imgElement) {
        if (orphan.photo.startsWith('data:') || orphan.photo.startsWith('/')) {
          imgElement.src = orphan.photo;
        } else {
          try {
            const proxiedImageResponse = await firstValueFrom(
              this.imageProxyService.getProxiedImage(orphan.photo)
            );
            imgElement.src = proxiedImageResponse.data;
          } catch (error) {
            console.error('Error proxying image:', error);
            imgElement.src = orphan.photo;
          }
        }

        // Wait for the image to load
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });
      }

      // Create PDF with A5 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      // Load and add the background image first
      try {
        const backgroundImage = await this.loadImage('/assets/orphanCard2.jpg');
        const imgWidth = 148; // A5 width in mm
        const imgHeight = 210; // A5 height in mm
        pdf.addImage(backgroundImage, 'JPEG', 0, 0, imgWidth, imgHeight);
      } catch (error) {
        console.error('Error loading background image:', error);
      }

      // Render the content
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        backgroundColor: null // Transparent background
      });

      // Add the content overlay
      const imgWidth = 148; // A5 width in mm
      const imgHeight = 210; // A5 height in mm
      const canvasDataURL = canvas.toDataURL('image/png');
      pdf.addImage(canvasDataURL, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      const fileName = `${orphan.lastName.toLowerCase().replace(/\s+/g, '-')}-card.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please make sure all images are accessible and try again.');
    }
  }
}