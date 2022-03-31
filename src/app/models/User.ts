export interface User {
    // id?: number,  el ? para que sea opcional
    id: number,
    usuario: string,
    password: string,
    token: string,
    created_at: Date,
}