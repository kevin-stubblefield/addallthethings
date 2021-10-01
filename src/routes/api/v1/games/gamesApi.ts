import { HttpClient, Token } from '../../../../interfaces/httpClient';

export class IGDBAuthApi extends HttpClient {
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

export class IGDBApi extends HttpClient {
  private readonly clientId: string;
  private readonly token: Token;

  private readonly defaultFields: string[];

  constructor(baseURL: string, clientId: string, token: Token) {
    super(baseURL);
    this.clientId = clientId;
    this.token = token;

    this.defaultFields = [
      'name',
      'rating',
      'cover.*',
      'url',
      'first_release_date',
    ];
  }

  async searchGames(query: string, fields: string[] = []): Promise<any> {
    query = `search "${query}"`;
    const body = this.prepareRequestBody(fields, query);

    console.log(body);

    return await this.instance.post('/games', body, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
  }

  async getGamesById(
    ids: number[] | string[],
    fields: string[] = []
  ): Promise<any> {
    const idString = ids.join(',');

    const body = this.prepareRequestBody(
      fields,
      '',
      `where id = (${idString})`
    );

    return await this.instance.post('/games', body, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
  }

  // TODO: replace with class to make it more dynamic
  private prepareRequestBody(
    fields: string[] = [],
    query: string = '',
    where: string = '',
    limit: string = '',
    offset: string = ''
  ): string {
    let requestBody: string;

    if (fields.length === 0) {
      fields = this.defaultFields;
    }

    requestBody = `fields ${fields.join(',')};`;

    if (query) {
      requestBody += query;

      if (!query.endsWith(';')) {
        requestBody += ';';
      }
    }

    if (where) {
      requestBody += where;

      if (!where.endsWith(';')) {
        requestBody += ';';
      }
    }

    if (limit) {
      requestBody += limit;

      if (!limit.endsWith(';')) {
        requestBody += ';';
      }
    }

    if (offset) {
      requestBody += offset;

      if (!offset.endsWith(';')) {
        requestBody += ';';
      }
    }

    return requestBody;
  }
}
