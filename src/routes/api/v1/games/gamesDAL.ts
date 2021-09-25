import axios, { AxiosInstance, AxiosResponse } from 'axios';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  private _handleError = (error: any) => Promise.reject(error);
}

export type Token = {
  accessToken: 'string';
  expiresIn: number;
  tokenType: string;
};

export class AuthApi extends HttpClient {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(baseURL: string, clientId: string, clientSecret: string) {
    super(baseURL);
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async getToken(): Promise<Token> {
    const result = await this.instance.post(
      `/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`
    );

    let token: Token = {
      accessToken: result.access_token,
      expiresIn: result.expires_in,
      tokenType: result.token_type,
    };

    return token;
  }
}

// export class GamesApi extends HttpClient {
//   private readonly clientId: string;
//   private readonly token: Token;

//   constructor(baseURL: string, clientId: string, token: Token) {
//     super(baseURL);
//     this.clientId = clientId;
//     this.token = token;
//   }
// }
