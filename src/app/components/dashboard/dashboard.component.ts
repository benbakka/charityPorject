import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { Subscription } from 'rxjs';
import { DashboardService, DashboardStatistics, ChartData } from '../../services/dashboard.service';
import { SelectItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

interface YearOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    FormsModule,
    DropdownModule,
    ChartModule,
    ProgressSpinnerModule,
    CardModule
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  isDarkMode = false;
  selectedTimeframe = 'month';
  selectedYear: number = new Date().getFullYear();
  availableYears: YearOption[] = [];
  isLoading = true;
  error: string | null = null;

  // Chart Data
  donationsChartData: any;
  donationsChartOptions: any;
  locationChartData: any;
  locationChartOptions: any;
  projectStatusChartData: any;
  projectStatusChartOptions: any;
  genderDistributionData: any;
  genderDistributionOptions: any;
  genderChartData: any;
  genderChartOptions: any;
  topDonorsChartData: any;
  topDonorsChartOptions: any;

  statistics: DashboardStatistics = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingProjects: 0,
    totalDonations: 0,
    totalDonors: 0,
    registeredOrphans: 0,
    monthlyDonationGrowth: 0
  };

  notifications = [
    { id: 1, title: 'New Donation Received', message: '$1,000 donated to Project Hope', time: '2 hours ago', type: 'donation' },
    { id: 2, title: 'Project Update', message: 'Education Fund reached 75% of goal', time: '5 hours ago', type: 'project' },
    { id: 3, title: 'New Donor Registration', message: 'Sarah Johnson joined as a donor', time: '1 day ago', type: 'donor' }
  ];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {
    // Initialize with static data first
    this.genderChartData = {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [30, 70],
        backgroundColor: ['#42A5F5', '#FF69B4'],
        hoverBackgroundColor: ['#64B5F6', '#FF83C3']
      }]
    };

    this.genderChartOptions = {
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%';
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  ngOnInit(): void {
    // Initialize available years
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({length: 6}, (_, i) => {
      const year = currentYear - 2 + i;
      return {
        label: year.toString(),
        value: year
      };
    });

    this.initializeChartOptions();
    this.loadDashboardData();
    // Comment out for now to test with static data
    // this.loadChartData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  onYearChange(year: number) {
    console.log('Year changed to:', year);
    this.selectedYear = year;
    this.loadChartData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.dashboardService.getStatistics().subscribe({
        next: (data) => {
          this.statistics = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.error = 'Failed to load dashboard data';
          this.isLoading = false;
        }
      })
    );
  }

  loadChartData() {
    this.isLoading = true;
    console.log('Loading chart data for year:', this.selectedYear);

    // Load monthly donations data
    this.dashboardService.getMonthlyDonationsChart(this.selectedYear).subscribe(
      (data) => {
        console.log('Received chart data:', data);
        this.donationsChartData = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading chart data:', error);
        this.error = 'Failed to load chart data';
        this.isLoading = false;
      }
    );

    // Load orphan gender distribution
    this.dashboardService.getOrphanGenderDistribution().subscribe({
      next: (data) => {
        console.log('Received gender data:', data);
        
        // Ensure we have valid numbers
        const malePercentage = data.malePercentage || 0;
        const femalePercentage = data.femalePercentage || 0;
        
        console.log(`Setting chart data - Male: ${malePercentage}%, Female: ${femalePercentage}%`);
        
        this.genderChartData = {
          labels: ['Male', 'Female'],
          datasets: [
            {
              data: [malePercentage, femalePercentage],
              backgroundColor: ['#42A5F5', '#FF69B4'],
              hoverBackgroundColor: ['#64B5F6', '#FF83C3'],
              borderWidth: 0
            }
          ]
        };
        
        console.log('Updated chart data:', this.genderChartData);
        
        // Force chart update
        this.genderChartData = { ...this.genderChartData };
      },
      error: (error) => {
        console.error('Error loading gender distribution data:', error);
        this.error = 'Failed to load gender distribution data';
      }
    });

    // Load top donors data
    this.dashboardService.getTopDonors(5).subscribe({
      next: (donors) => {
        console.log('Received donors data in component:', donors);
        
        if (!donors || donors.length === 0) {
          console.log('No donors data available');
          // Set empty data to show the chart structure
          this.topDonorsChartData = {
            labels: ['No data available'],
            datasets: [{
              label: 'Total Donations ($)',
              data: [0],
              backgroundColor: '#e0e0e0',
              borderWidth: 0
            }]
          };
          return;
        }

        this.topDonorsChartData = {
          labels: donors.map(d => d.name || 'Anonymous'),
          datasets: [
            {
              label: 'Total Donations ($)',
              data: donors.map(d => d.totalAmount || 0),
              backgroundColor: donors.map(() => '#42A5F5'),
              hoverBackgroundColor: donors.map(() => '#64B5F6'),
              borderWidth: 0
            }
          ]
        };
        console.log('Updated top donors chart data:', this.topDonorsChartData);
      },
      error: (error) => {
        console.error('Error loading top donors data:', error);
        // Show empty chart on error
        this.topDonorsChartData = {
          labels: ['Error loading data'],
          datasets: [{
            label: 'Total Donations ($)',
            data: [0],
            backgroundColor: '#ffcdd2',
            borderWidth: 0
          }]
        };
      }
    });
  }

  initializeChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.donationsChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: any) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(value);
            }
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    this.genderDistributionOptions = {
      plugins: {
        legend: {
          labels: {
            color: this.isDarkMode ? '#ffffff' : '#495057'
          }
        },
        title: {
          display: true,
          text: 'Donor Gender Distribution',
          color: this.isDarkMode ? '#ffffff' : '#495057'
        }
      }
    };

    this.genderChartOptions = {
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          labels: {
            color: '#495057',
            font: {
              size: 13,
              family: 'Arial'
            },
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return context.label + ': ' + context.raw + '%';
            }
          }
        }
      },
      cutout: '60%',
      radius: '90%',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        animateScale: true
      }
    };

    this.topDonorsChartOptions = {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `$${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            callback: (value: number) => {
              return '$' + value.toLocaleString();
            }
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  logout(): void {
    this.authService.logout();
  }

  retryLoading(): void {
    this.loadDashboardData();
    this.loadChartData();
  }
}
