export interface JwtRequestDTO {
    username: string;
    password: string;
}

export interface JwtResponseDTO {
    jwttoken: string;
}