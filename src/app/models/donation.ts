import { CharityProject } from './charity-project';
import { Donor } from './donor';

export interface Donation {
    id?: number;
    amount: number;
    charityProject: CharityProject;
    donor: Donor;
    dateDonation: Date;
}

// DTO for API requests
export interface DonationDTO {
    id?: number;
    amount: number;
    charityProject: CharityProject;
    donor: Donor;
    dateDonation: string;  // ISO date string for API communication
}
