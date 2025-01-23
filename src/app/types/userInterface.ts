export interface UserData {
    username: string;
    name: string;
    email: string;
    role?: string;
}

export const intValueUser: UserData[] = [
    {
        username: "",
        name: "",
        email: "",
        role: "",
    }
];

export const fakeDataUser: UserData[] = [
    {
        username: "Admin",
        name: "Administrator",
        email: "admin@localhost",
        role: "admin",
    },
    {
        username: "User",
        name: "User",
        email: "user@localhost",
        role: "user",
    },
    {
        username: "Guest",
        name: "Guest",
        email: "guest@localhost",
    }
];


