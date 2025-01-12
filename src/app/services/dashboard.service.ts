import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DonationService } from './donation.service';
import { Donation } from '../models/donation';

export interface DashboardStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  pendingProjects: number;
  totalDonations: number;
  totalDonors: number;
  registeredOrphans: number;
  monthlyDonationGrowth: number;
}

export interface ChartData {
  labels: string[];
  datasets: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;
  private statistics = new BehaviorSubject<DashboardStatistics | null>(null);
  private monthlyDonations = new BehaviorSubject<ChartData | null>(null);
  private projectDistribution = new BehaviorSubject<ChartData | null>(null);
  private donorDemographics = new BehaviorSubject<ChartData | null>(null);

  constructor(
    private http: HttpClient,
    private donationService: DonationService
  ) {}

  getStatistics(): Observable<DashboardStatistics> {
    const defaultStats: DashboardStatistics = {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      pendingProjects: 0,
      totalDonations: 0,
      totalDonors: 0,
      registeredOrphans: 0,
      monthlyDonationGrowth: 0
    };

    return forkJoin({
      projects: this.http.get<any[]>(`${this.baseUrl}/charity-projects`).pipe(
        catchError(() => of([]))
      ),
      donations: this.http.get<any[]>(`${this.baseUrl}/donations`).pipe(
        catchError(() => of([]))
      ),
      donors: this.http.get<any[]>(`${this.baseUrl}/donors`).pipe(
        catchError(() => of([]))
      ),
      orphans: this.http.get<any[]>(`${this.baseUrl}/orphans`).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(data => {
        const stats: DashboardStatistics = {
          totalProjects: data.projects.length,
          activeProjects: data.projects.filter(p => p.status === 'active').length,
          completedProjects: data.projects.filter(p => p.status === 'completed').length,
          pendingProjects: data.projects.filter(p => p.status === 'pending').length,
          totalDonations: data.donations.reduce((sum, d) => sum + (d.amount || 0), 0),
          totalDonors: data.donors.length,
          registeredOrphans: data.orphans.length,
          monthlyDonationGrowth: this.calculateMonthlyGrowth(data.donations)
        };
        this.statistics.next(stats);
        return stats;
      }),
      catchError(() => of(defaultStats))
    );
  }

  getMonthlyDonationsChart(year: number): Observable<ChartData> {
    console.log('Getting monthly donations chart for year:', year);
    return this.donationService.getAllDonations().pipe(
      map(donations => {
        console.log('All donations:', donations);
        const monthlyTotals = this.processMonthlyDonations(donations, year);
        
        return {
          labels: Object.keys(monthlyTotals),
          datasets: [
            {
              label: 'Monthly Donations',
              data: Object.values(monthlyTotals),
              fill: false,
              borderColor: '#4CAF50',
              tension: 0.4
            }
          ]
        };
      })
    );
  }

  getProjectDistributionChart(): Observable<ChartData> {
    const emptyChart: ChartData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    };

    return this.http.get<any[]>(`${this.baseUrl}/charity-projects`).pipe(
      map(projects => {
        const distribution = this.processProjectDistribution(projects);
        const chartData: ChartData = {
          labels: Object.keys(distribution),
          datasets: [{
            data: Object.values(distribution),
            backgroundColor: ['#FF9800', '#2196F3', '#9C27B0', '#F44336']
          }]
        };
        this.projectDistribution.next(chartData);
        return chartData;
      }),
      catchError(() => of(emptyChart))
    );
  }

  getDonorDemographicsChart(): Observable<ChartData> {
    const emptyChart: ChartData = {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: []
      }]
    };

    return this.http.get<any[]>(`${this.baseUrl}/donors`).pipe(
      map(donors => {
        const demographics = this.processDonorDemographics(donors);
        const chartData: ChartData = {
          labels: Object.keys(demographics),
          datasets: [{
            data: Object.values(demographics),
            backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0']
          }]
        };
        this.donorDemographics.next(chartData);
        return chartData;
      }),
      catchError(() => of(emptyChart))
    );
  }

  getDonorGenderDistribution(): Observable<{malePercentage: number, femalePercentage: number}> {
    return this.http.get<any[]>(`${this.baseUrl}/donors`).pipe(
      map(donors => {
        const totalDonors = donors.length;
        const maleDonors = donors.filter(donor => donor.gender === 'MALE').length;
        const femaleDonors = donors.filter(donor => donor.gender === 'FEMALE').length;
        
        return {
          malePercentage: (maleDonors / totalDonors) * 100,
          femalePercentage: (femaleDonors / totalDonors) * 100
        };
      }),
      catchError(error => {
        console.error('Error fetching donor gender distribution:', error);
        return throwError(() => error);
      })
    );
  }

  getOrphanGenderDistribution(): Observable<{malePercentage: number, femalePercentage: number}> {
    return this.http.get<any[]>(`${this.baseUrl}/orphans`).pipe(
      map(orphans => {
        console.log('Raw orphans data:', orphans);
        console.log('Sample orphan object:', orphans[0]); // Log first orphan to see structure
        
        const totalOrphans = orphans.length;
        if (totalOrphans === 0) {
          console.log('No orphans found');
          return { malePercentage: 0, femalePercentage: 0 };
        }
        
        const maleOrphans = orphans.filter(orphan => orphan.gender.toUpperCase() === 'MALE').length;
        const femaleOrphans = orphans.filter(orphan => orphan.gender.toUpperCase() === 'FEMALE').length;
        
        console.log(`Total orphans: ${totalOrphans}`);
        console.log(`Male orphans: ${maleOrphans}`);
        console.log(`Female orphans: ${femaleOrphans}`);
        
        const result = {
          malePercentage: Math.round((maleOrphans / totalOrphans) * 100),
          femalePercentage: Math.round((femaleOrphans / totalOrphans) * 100)
        };
        console.log('Calculated gender distribution:', result);
        return result;
      }),
      catchError(error => {
        console.error('Error in getOrphanGenderDistribution:', error);
        return throwError(() => error);
      })
    );
  }

  getTopDonors(limit: number = 5): Observable<any[]> {
    console.log('Fetching top donors...');
    return this.http.get<any[]>(`${this.baseUrl}/donations`).pipe(
      map(donations => {
        console.log('Raw donations data:', donations);
        
        // Group donations by donor and calculate total amount
        const donorTotals = donations.reduce((acc, donation) => {
          const donorId = donation.donor.id || donation.donorId;
          const donorName = donation.donor?.name || donation.donorName;
          
          if (!acc[donorId]) {
            acc[donorId] = {
              donorName: donorName,
              totalAmount: 0
            };
          }
          acc[donorId].totalAmount += parseFloat(donation.amount);
          return acc;
        }, {});

        console.log('Grouped donor totals:', donorTotals);

        // Convert to array and sort by total amount
        const sortedDonors = Object.entries(donorTotals)
          .map(([id, data]: [string, any]) => ({
            id,
            name: data.donorName,
            totalAmount: data.totalAmount
          }))
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, limit);

        console.log('Final sorted top donors:', sortedDonors);
        return sortedDonors;
      }),
      catchError(error => {
        console.error('Error fetching top donors:', error);
        return throwError(() => error);
      })
    );
  }

  private calculateMonthlyGrowth(donations: any[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = donations
      .filter(d => {
        const date = new Date(d.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    const lastMonth = donations
      .filter(d => {
        const date = new Date(d.date);
        return date.getMonth() === (currentMonth - 1) && date.getFullYear() === currentYear;
      })
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    if (lastMonth === 0) return 0;
    return Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1));
  }

  private processMonthlyDonations(donations: Donation[], year: number): Record<string, number> {
    const monthlyTotals: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with 0
    monthNames.forEach(month => {
      monthlyTotals[month] = 0;
    });

    // Process donations
    donations.forEach(donation => {
      try {
        if (donation && donation.amount && donation.dateDonation) {
          // Ensure we're working with a Date object
          const donationDate = new Date(donation.dateDonation);
          
          console.log('Processing donation for chart:', {
            date: donation.dateDonation,
            parsedDate: donationDate,
            year: donationDate.getFullYear(),
            targetYear: year,
            amount: donation.amount
          });

          // Only process donations from the selected year
          if (donationDate.getFullYear() === year) {
            const monthKey = monthNames[donationDate.getMonth()];
            const amount = parseFloat(donation.amount.toString());
            if (!isNaN(amount)) {
              monthlyTotals[monthKey] += amount;
              console.log(`Added ${amount} to ${monthKey} ${year}`);
            }
          }
        }
      } catch (error) {
        console.error('Error processing donation:', donation, error);
      }
    });

    console.log(`Final monthly totals for ${year}:`, monthlyTotals);
    return monthlyTotals;
  }

  private processProjectDistribution(projects: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    projects.forEach(project => {
      if (project.category) {
        distribution[project.category] = (distribution[project.category] || 0) + 1;
      }
    });

    return distribution;
  }

  private processDonorDemographics(donors: any[]): Record<string, number> {
    const demographics: Record<string, number> = {};
    
    donors.forEach(donor => {
      if (donor.region) {
        demographics[donor.region] = (demographics[donor.region] || 0) + 1;
      }
    });

    return demographics;
  }
}
