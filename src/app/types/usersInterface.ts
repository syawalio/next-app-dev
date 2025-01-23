export interface UsersData {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    job?: string;
}

export interface CreateUsersData {
    name: string;
    job: string;
}