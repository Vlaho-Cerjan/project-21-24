export interface User {
    id: string,
    email: string,
    username: string,
    first_name: string | null,
    last_name: string | null,
    description: string | null,
    roles: string[] | string,
    token: string | null,
};