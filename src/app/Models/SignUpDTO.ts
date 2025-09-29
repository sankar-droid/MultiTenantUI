export interface SignUpDTO{
    username:string;
    password:string;
    email:string;
    tenant:string;
    workspaceName?:string;
}

export interface loginDTO{
     userName:string;
     password:string;
     tenant:string;
}