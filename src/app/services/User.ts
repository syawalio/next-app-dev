import { QueryClient } from '@tanstack/react-query';

const API_URL = 'https://reqres.in/api/users';

export const fetchUsers = async (page: number, per_page: number) => {
    const response = await fetch(`https://reqres.in/api/users?page=${page}&per_page=${per_page}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const getUserById = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const createUser = async (user: { name: string; job: string }) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const updateUser = async (id: number, user: { name: string; job: string }) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const deleteUser = async (id: number) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

// Initialize a QueryClient instance
export const queryClient = new QueryClient();