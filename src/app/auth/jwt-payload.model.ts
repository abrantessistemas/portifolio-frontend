export class JwtPayload {
   
        must_change_password: boolean;
        user_id: string;
        user_name:string;
        name:string;
        exp: number;
        tenant: string;
        authorities: string[];
        flow: string;      
}