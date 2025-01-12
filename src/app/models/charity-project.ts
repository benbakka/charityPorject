export interface CharityProject {
    id?: number;
    name: string;
    date: Date;
    location: string;
    goal: string;
    budget: number;
    status: string; // "Active," "Completed," "On Hold," "Cancelled"
}
