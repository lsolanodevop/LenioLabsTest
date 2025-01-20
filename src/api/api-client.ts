import { APIRequestContext, request } from '@playwright/test';
import testData from '../olds/test-data';

export class ApiClient {
  private requestContext: APIRequestContext;
  private baseUrl: string;
  private jwtToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

    async initialize() { 
        this.requestContext = await request.newContext({
            baseURL: this.baseUrl,
            extraHTTPHeaders: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
        });
    }

async authenticate(): Promise<void> {
    const authData = testData.authData();
    const authRequestContext = await request.newContext({ baseURL: this.baseUrl });

    const response = await authRequestContext.post('api/auth/login', { data: authData });

    if (!response.ok()) {
        const errorBody = await response.text();
        throw new Error(`Authentication failed with status ${response.status()}: ${errorBody}`);
    }

    const responseBody = await response.json();
    // console.log(responseBody);
    this.jwtToken = responseBody.token;

    await authRequestContext.dispose();
    if (!this.requestContext) {
        throw new Error("Request context not initialized. Call initialize() first.");
    }

    if(this.requestContext){
        await this.requestContext.dispose();
    }
    this.requestContext = await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.jwtToken}`, // Inyectar el token aquí
        },
    });
  }

  async post(endpoint: string, data: any) {
    const response = (await this.requestContext.post(endpoint, { data }));
    return response;
  }

  async get(endpoint: string) {
    const response = await this.requestContext.get(endpoint);
    return response;
  }

    async dispose() {
        await this.requestContext.dispose();
    }
}