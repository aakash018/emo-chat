declare namespace NodeJS {
  interface ProcessEnv {
    JWT_TOKEN: string;
    REF_JWT_TOKEN: string;
    CLIENT_END_POINT: string;
    GOOGLE_CLIENT_ID: string;
    GOODLE_CLIENT_SECRET: string;
    SERVER_END_POINT: string;
    POSTGRESS_USER: string;
    POSTGRESS_PASSWORD: string;
    POSTGRESS_DATABASE: string;
    POSTGRESS_HOST: string;
  }
}