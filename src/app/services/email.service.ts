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
  private apiUrl = 'https://charitybackend.onrender.com/api/email';

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

    // Add background image
    try {
      doc.addImage('assets/faseelah letterhead v2 .jpg', 'JPEG', 0, 0, pageWidth, pageHeight);
    } catch (error) {
      console.warn('Could not load background image:', error);
    }


    // Add title with 50px spacing from logo
    doc.setFontSize(18);
    doc.text('Tax Receipt for Charitable Donation', pageWidth / 2, 60, { align: 'center' });

    // Add donation details
    doc.setFontSize(12);
    const startY = 80;
    const lineHeight = 8;
    let currentY = startY;

    // Format the date
    const donationDate = donation.dateDonation ? new Date(donation.dateDonation) : new Date();
    const formattedDate = donationDate.toLocaleDateString();

    // Add donation information
    doc.text(`Receipt Date: ${formattedDate}`, margin, currentY);
    currentY += lineHeight * 2;

    // Add donor information with adjusted spacing
    doc.text(`To: ${donation.donor.name}`, margin, currentY);
    currentY += lineHeight;
    if (donation.donor.address) {
      doc.text(donation.donor.address, margin, currentY);
      currentY += lineHeight;
    }
    if (donation.donor.city && donation.donor.state && donation.donor.zip) {
      doc.text(`${donation.donor.city}, ${donation.donor.state} ${donation.donor.zip}`, margin, currentY);
      currentY += lineHeight * 3; 
    }

    // Add salutation - adjusted spacing
    doc.text(`Dear ${donation.donor.name},`, margin, currentY);
    currentY += lineHeight * 2;

    // Add main content with adjusted spacing
    const mainContent = `On behalf of Faseelah Charity, we would like to thank you for your generous contributions. Your generosity helps further our mission in improving lives of the most vulnerable and underserved people in the regions we serve. No goods or services were provided to you in exchange for your donation.`;
    const splitContent = doc.splitTextToSize(mainContent, pageWidth - (2 * margin));
    doc.text(splitContent, margin, currentY);
    currentY += lineHeight * splitContent.length;

    // Add donation amount - adjusted spacing
    const amountInWords = this.numberToWords(donation.amount);
    const currentDate = new Date();
    const month = currentDate.toLocaleString('en-US', { month: 'long' });
    const day = currentDate.getDate();
    doc.text(`Your total donation amount for ${month} ${day}, ${currentDate.getFullYear()} is $ ${donation.amount.toFixed(2)} (${amountInWords} Dollars).`, margin, currentY);
    currentY += lineHeight * 2;

    // Add thank you message - adjusted spacing
    const thankYouMessage = 'Thank you again for your support of Faseelah Charity mission and we look forward to your continued support.';
    const splitThankYou = doc.splitTextToSize(thankYouMessage, pageWidth - (2 * margin));
    doc.text(splitThankYou, margin, currentY);
    currentY += lineHeight * (splitThankYou.length + 1);

    // Add tax deductible notice - adjusted spacing
    doc.text(`Please note that letter serves as your tax deductible receipt for the year of ${new Date().getFullYear()}.`, margin, currentY);
    currentY += lineHeight * 2;

    // Add signature section - adjusted spacing
    doc.text('Many thanks,', margin, currentY);
    currentY += lineHeight;
    doc.text('Executive Director', margin, currentY);
    currentY += lineHeight;
    doc.text('Youness Ktiri', margin, currentY);
   
    
    
    return doc.output('blob');
  }

  private numberToWords(num: number): string {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    if (num === 0) return 'zero';

    const numStr = num.toString();
    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);

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

    let result = convert(dollars);
    return result;
  }

  generateDonationHistoryPDF(donor: any, donations: any[], startDate?: Date, endDate?: Date): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    const footerHeight = 45; // Increased footer height
    const maxContentY = pageHeight - footerHeight;
    const lineHeight = 7;
    const tableStartY = 180; // Fixed position for table start
    const entriesPerPage = Math.floor((maxContentY - tableStartY) / lineHeight);

    // Function to add header section
    const addHeaderSection = () => {
      // Add background image
      try {
        doc.addImage('assets/faseelah letterhead v2 .jpg', 'JPEG', 0, 0, pageWidth, pageHeight);
      } catch (error) {
        console.warn('Could not load background image:', error);
      }
    };

    // Function to add table headers
    const addTableHeaders = (yPosition: number) => {
      const colWidths = [40, 40, contentWidth - 80];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Date', margin, yPosition);
      doc.text('Amount', margin + colWidths[0], yPosition);
      doc.text('Project', margin + colWidths[0] + colWidths[1], yPosition);
      doc.setLineWidth(0.2);
      doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
      return yPosition + lineHeight * 1.5;
    };

    // Initialize first page
    addHeaderSection();

    // Add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Donation History Report', pageWidth / 2, 60, { align: 'center' });

    // Add initial content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let currentY = 80;

    // Add date range
    if (startDate && endDate) {
      const formattedStartDate = startDate.toLocaleDateString();
      const formattedEndDate = endDate.toLocaleDateString();
      doc.text(`Period: ${formattedStartDate} to ${formattedEndDate}`, margin, currentY);
    } else {
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, currentY);
    }
    currentY += lineHeight * 2;

    // Add donor information
    doc.text(`To: ${donor.name}`, margin, currentY);
    currentY += lineHeight;
    if (donor.address) {
      doc.text(donor.address, margin, currentY);
      currentY += lineHeight;
    }
    if (donor.city && donor.state && donor.zip) {
      doc.text(`${donor.city}, ${donor.state} ${donor.zip}`, margin, currentY);
      currentY += lineHeight * 2;
    }

    // Add salutation
    doc.text(`Dear ${donor.name},`, margin, currentY);
    currentY += lineHeight * 2;

    // Add introduction
    const mainContent = 'This letter serves as a record of your charitable contributions to Faseelah Charity. We greatly appreciate your continued support in helping us serve those in need. Below is a detailed summary of your donations' + (startDate && endDate ? ' for the specified period.' : '.');
    const splitContent = doc.splitTextToSize(mainContent, contentWidth);
    doc.text(splitContent, margin, currentY);

    // Start table at fixed position
    currentY = tableStartY;
    currentY = addTableHeaders(currentY);

    // Add donation entries
    let totalAmount = 0;
    const colWidths = [40, 40, contentWidth - 80];

    donations.forEach((donation, index) => {
      if (currentY > maxContentY - lineHeight * 3) {
        doc.addPage();
        addHeaderSection();
        currentY = 80;
        currentY = addTableHeaders(currentY);
      }

      doc.setFont('helvetica', 'normal');
      const donationDate = new Date(donation.dateDonation).toLocaleDateString();
      doc.text(donationDate, margin, currentY);
      doc.text(`$${donation.amount.toFixed(2)}`, margin + colWidths[0], currentY);
      doc.text(donation.charityProjectName || '', margin + colWidths[0] + colWidths[1], currentY);
      totalAmount += donation.amount;
      currentY += lineHeight;
    });

    // Add final separator
    currentY += lineHeight / 2;
    doc.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
    currentY += lineHeight * 1.5;

    // Check if we need a new page for summary
    if (currentY > maxContentY - 80) {
      doc.addPage();
      addHeaderSection();
      currentY = 80;
    }

    // Add total
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Donations: $${totalAmount.toFixed(2)}`, margin, currentY);
    currentY += lineHeight * 2;

    // Add thank you message
    doc.setFont('helvetica', 'normal');
    const thankYouMessage = 'Thank you for your generous support. Your contributions make a significant impact in helping us achieve our charitable mission. All donations to Faseelah Charity are tax-deductible to the extent allowed by law.';
    const splitThankYou = doc.splitTextToSize(thankYouMessage, contentWidth);
    doc.text(splitThankYou, margin, currentY);
    currentY += (lineHeight * splitThankYou.length) + lineHeight * 2;

    // Add signature
    doc.text('Sincerely,', margin, currentY);
    currentY += lineHeight;
    doc.text('Executive Director', margin, currentY);
    currentY += lineHeight;
    doc.text('Youness Ktiri', margin, currentY);

    return doc.output('blob');
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
