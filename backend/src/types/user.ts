export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}

export interface UserCreateDTO {
    email: string;
    name: string;
    password: string;
}

export interface UserLoginDTO {
    email: string;
    password: string;
}
