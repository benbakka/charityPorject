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
  private apiUrl = 'https://charitybackend.onrender.com/api/email'; // Replace with your actual email API endpoint

  constructor(private http: HttpClient) { }

  generateTaxReceiptPDF(donation: Donation): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add logo at very top with proper aspect ratio
    try {
      const logoWidth = 80;  // Increased width
      const logoHeight = 35; // Increased height proportionally
      doc.addImage('assets/logo.png', 'PNG', margin, 10, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Could not load logo:', error);
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
      currentY += lineHeight;
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
    doc.text(`Your total donation amount of the year ${new Date().getFullYear()} is $ ${donation.amount.toFixed(2)} (${amountInWords} Dollars).`, margin, currentY);
    currentY += lineHeight * 2;

    // Add thank you message - adjusted spacing
    doc.text('Thank you again for your support of Faseelah Charity mission and we look forward to your continued support.', margin, currentY);
    currentY += lineHeight * 2;

    // Add tax deductible notice - adjusted spacing
    doc.text(`Please note that letter serves as your tax deductible receipt for the year of ${new Date().getFullYear()}.`, margin, currentY);
    currentY += lineHeight * 2;

    // Add signature section - adjusted spacing
    doc.text('Many thanks,', margin, currentY);
    currentY += lineHeight;
    doc.text('Executive Director', margin, currentY);
    currentY += lineHeight;
    doc.text('Youness Ktiri', margin, currentY);

    // Add footer image - 80 points from bottom
    try {
      const footerWidth = pageWidth - (2 * margin);
      const footerHeight = 45;
      const footerY = pageHeight - footerHeight - 15; // 15 points spacing above footer
      doc.addImage('assets/footer-with-bar.png', 'PNG', margin, footerY, footerWidth, footerHeight);
    } catch (error) {
      console.warn('Could not load footer image:', error);
      
      // Fallback to text footer if image fails to load
      doc.setFontSize(9);
      const footer = [
        'HQ: 24380 Orchard Lake Rd - Suite 108 - Farmington Hills, MI. 48336',
        'Mailing Address: P. O. Box 3382 - Farmington Hills, MI. 48333 - 3382',
        '(313) 666-7999',
        'info@faseelah.org',
        'Faseelah Charity is a registered 501 (c) 3 Nonprofit Humanitarian Organization with Tax ID # 84-3282217'
      ];
      
      let footerY = pageHeight - 40;
      footer.forEach((line) => {
        doc.text(line, pageWidth / 2, footerY, { align: 'center' });
        footerY += 6;
      });
    }

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

  sendEmailWithTaxReceipt(donation: Donation, pdfBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('to', donation.donor.email);
    formData.append('subject', 'Tax Receipt for Your Donation');
    formData.append('body', `Dear ${donation.donor.name},\n\nThank you for your generous donation of $${donation.amount} to ${donation.charityProject.name}. Please find attached your tax receipt for your records.\n\nBest regards,\nYour Organization`);
    formData.append('attachment', pdfBlob, 'tax_receipt.pdf');

    return this.http.post(this.apiUrl + '/send-email', formData, {
      responseType: 'text'
    });
  }
}
