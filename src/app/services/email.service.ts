import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../models/donation';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/email';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  generateTaxReceiptPDF(donation: Donation): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7; // Reduced from 8 to 6 for tighter spacing
    let currentY = 60; // Starting higher up
    const currentYear = new Date().getFullYear();

    // Add background image
    try {
      doc.addImage('assets/faseelah letterhead v2 .jpg', 'JPEG', 0, 0, pageWidth, pageHeight);
    } catch (error) {
      console.warn('Could not load background image:', error);
    }

    // Add title
    doc.setFont('helvetica', 'bold'); // Set font to bold
    doc.setFontSize(14);
    doc.text(`Donation Tax Receipt`, pageWidth / 2, currentY, { align: 'center' });
    currentY += lineHeight * 2;
    doc.setFont('helvetica', 'normal'); // Reset font back to normal if needed

    // Add receipt date - right aligned
    const donationDate = donation.dateDonation ? new Date(donation.dateDonation) : new Date();
    const formattedDate = donationDate.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    doc.text(formattedDate, pageWidth - margin, currentY, { align: 'right' });
    currentY += lineHeight * 2.5;

    // Add donor information with reduced spacing
    doc.text(donation.donor.name, margin, currentY);
    currentY += lineHeight;
    
    if (donation.donor.address) {
      doc.text(donation.donor.address, margin, currentY);
      currentY += lineHeight;
    }
    
    if (donation.donor.city && donation.donor.state && donation.donor.zip) {
      doc.text(`${donation.donor.city}, ${donation.donor.state} ${donation.donor.zip}`, margin, currentY);
      currentY += lineHeight * 2.8;
    }

    // Add salutation
    doc.text(`Dear ${donation.donor.name},`, margin, currentY);
    currentY += lineHeight * 2.8;

    // Add main content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const mainContent = 'Thank you for your generous contributions. Your generosity helps further our mission in improving the lives of the most vulnerable and underserved people in the regions we serve.';
    doc.text(doc.splitTextToSize(mainContent, pageWidth - (margin * 2)), margin, currentY);
    currentY += lineHeight * 2.5;

    // Add donation amount in bold
    doc.setFont('helvetica', 'bold');
    const monthYear = donationDate.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const dollars = Math.floor(donation.amount);
    const cents = Math.round((donation.amount % 1) * 100);
    const amountText = `Your total donation amount for ${monthYear} is $${donation.amount.toFixed(2)} (${this.numberToWords(dollars, true)} and ${this.numberToWords(cents)} cents).`;
    const wrappedText = doc.splitTextToSize(amountText, pageWidth - (margin * 2));
    doc.text(wrappedText, margin, currentY);
    currentY += lineHeight * (wrappedText.length + 0.5);

    // Add tax receipt notice
    doc.setFont('helvetica', 'normal');
    doc.text(`This letter serves as your donation receipt for ${monthYear}.`, margin, currentY);
    currentY += lineHeight * 1.5;

    // Add no goods or services notice in bold
    doc.setFont('helvetica', 'bold');
    doc.text('No goods or services were provided in exchange for this donation.', margin, currentY);
    currentY += lineHeight * 1.5;

    // Add closing in normal font
    doc.setFont('helvetica', 'normal');
    const closingText = 'On behalf of Faseelah Charity Team, we thank you again for your donation and look forward to your continued support.';
    doc.text(doc.splitTextToSize(closingText, pageWidth - (margin * 2)), margin, currentY);
    currentY += lineHeight * 3;

    // Add signature block with adjusted spacing
    doc.text('Sincerely', margin, currentY);
    currentY += lineHeight * 2;
    doc.text('Executive Director', margin, currentY);
    currentY += lineHeight;
    doc.text('Youness Ktiri', margin, currentY);

    return doc.output('blob');
  }

  generateDonationHistoryPDF(donor: any, donations: any[], startDate?: Date, endDate?: Date): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7; // Reduced for tighter spacing
    let currentY = 60; // Starting higher up
    const currentYear = new Date().getFullYear();

    // Add background image
    try {
      doc.addImage('assets/faseelah letterhead v2 .jpg', 'JPEG', 0, 0, pageWidth, pageHeight);
    } catch (error) {
      console.warn('Could not load background image:', error);
    }

    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Donation Report for ${currentYear}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += lineHeight * 2;
    doc.setFont('helvetica', 'normal');

    // Add receipt date - right aligned
    const donationDate = new Date().toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    doc.text(donationDate, pageWidth - margin, currentY, { align: 'right' });
    currentY += lineHeight * 2.5;

    // Add donor information with reduced spacing
    doc.text(donor.name, margin, currentY);
    currentY += lineHeight;
    
    if (donor.address) {
      doc.text(donor.address, margin, currentY);
      currentY += lineHeight;
    }
    
    if (donor.city && donor.state && donor.zip) {
      doc.text(`${donor.city}, ${donor.state} ${donor.zip}`, margin, currentY);
      currentY += lineHeight * 2.8;
    }

    // Add salutation
    doc.text(`Dear ${donor.name},`, margin, currentY);
    currentY += lineHeight * 2.8;

    // Add main content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const mainContent = 'Thank you for your generous contributions. Your generosity helps further our mission in improving the lives of the most vulnerable and underserved people in the regions we serve.';
    doc.text(doc.splitTextToSize(mainContent, pageWidth - (margin * 2)), margin, currentY);
    currentY += lineHeight * 2.5;

    // Calculate total amount
    let totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Add donation amount in bold
    doc.setFont('helvetica', 'bold');
    const amountText = `Your total donation for ${currentYear} is $${totalAmount.toFixed(2)} (${this.numberToWords(totalAmount, true)} and ${Math.round((totalAmount % 1) * 100)} cents).`;
    const wrappedText = doc.splitTextToSize(amountText, pageWidth - (margin * 2));
    doc.text(wrappedText, margin, currentY);
    currentY += lineHeight * (wrappedText.length + 0.5);

    // Add tax receipt notice
    doc.setFont('helvetica', 'normal');
    doc.text(`This letter serves as your donation receipt for the year ${currentYear}.`, margin, currentY);
    currentY += lineHeight * 1.5;

    // Add no goods or services notice in bold
    doc.setFont('helvetica', 'bold');
    doc.text('No goods or services were provided in exchange for this donation.', margin, currentY);
    currentY += lineHeight * 1.5;

    // Add closing
    doc.setFont('helvetica', 'normal');
    const closingText = 'On behalf of Faseelah Charity Team, we thank you again for your donation and look forward to your continued support.';
    doc.text(doc.splitTextToSize(closingText, pageWidth - (margin * 2)), margin, currentY);
    currentY += lineHeight * 3;

    // Add signature block
    doc.text('Sincerely', margin, currentY);
    currentY += lineHeight * 2;
    doc.text('Executive Director', margin, currentY);
    currentY += lineHeight;
    doc.text('Youness Ktiri', margin, currentY);

    return doc.output('blob');
  }


  private numberToWords(num: number, addCurrency: boolean = false): string {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    if (num === 0) return 'zero';

    function convertGroup(n: number): string {
      if (n === 0) return '';
      else if (n < 10) return ones[n];
      else if (n < 20) return teens[n - 10];
      else {
        const ten = Math.floor(n / 10);
        const one = n % 10;
        return tens[ten] + (one ? '-' + ones[one] : '');
      }
    }

    function convert(n: number): string {
      if (n === 0) return '';
      else if (n < 100) return convertGroup(n);
      else if (n < 1000) {
        const hundreds = Math.floor(n / 100);
        const remainder = n % 100;
        return ones[hundreds] + ' hundred' + (remainder ? ' and ' + convertGroup(remainder) : '');
      } else if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        return convert(thousands) + ' thousand' + (remainder ? ' ' + convert(remainder) : '');
      }
      return '';
    }

    let result = convert(Math.floor(num));
    if (addCurrency) {
      result += ` dollars`;
    }
    
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  sendEmail(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email`, formData, {
      responseType: 'text'
    });
  }

  sendEmailWithTaxReceipt(donation: Donation, pdfBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('to', donation.donor.email);
    formData.append('subject', 'Tax Receipt for Your Donation');
    formData.append('body', `Dear ${donation.donor.name},\n\nThank you for your generous donation of $${donation.amount} to ${donation.charityProject.name}. Please find attached your tax receipt for your records.\n\nBest regards,\nFaseelah Charity`);
    formData.append('attachment', pdfBlob, 'tax_receipt.pdf');

    return this.sendEmail(formData);
  }
}
