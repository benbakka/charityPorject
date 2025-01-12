export interface OrphanIDCard {
    id:number;
    orphanId: string;
    photo: string;
    firstName: string;
    lastName: string;
    dob: Date | null;
    placeOfBirth: string;
    gender: string;
    location: string;
    country: string;
    healthStatus: string;
    specialNeeds: string;
    familyInformation: {
        ethnicGroup: string;
        spokenLanguage: string;
        fatherName: string;
        fatherDateOfDeath: Date | null;
        fatherCauseOfDeath: string;
        motherName: string;
        motherStatus: string;
        motherDateOfDeath: Date | null;
        motherCauseOfDeath: string;
        numberOfSiblings: number;
        guardianName: string;
        relationToOrphan: string;
        livingCondition: string;
    };
    education: {
        schoolName: string;
        gradeLevel: string;
        favoriteSubject: string;
        educationNeeds: string;
        schoolPerformance: string;
        orphanDream: string;
        favoriteHobbies: string;
        supervisorComments: string;
    };
}

