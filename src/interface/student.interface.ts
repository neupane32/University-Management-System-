export interface StudentInterface {
 details:Details
    email: string;
    username: string;
    password: string;
}

interface Details {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone_number: string;
    DOB: string;
    gender: string;
    admissionYear: number;
}

