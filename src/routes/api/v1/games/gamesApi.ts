import {
  HttpClient,
  Token,
  ApiRequestBodyWriter,
} from '../../../../interfaces/httpClient';
import { GameApi } from '../../../../models/media.model';

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

  constructor(baseURL: string, clientId: string, token: Token) {
    super(baseURL);
    this.clientId = clientId;
    this.token = token;
  }

  async searchGames(query: string, fields: string[] = []): Promise<GameApi[]> {
    let writer = new IGDBRequestBodyWriter();
    writer.field(fields);
    writer.search(query);

    const body = writer.writeRequestBody();

    return await this.instance.post('/games', body, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
  }

  async getGamesById(ids: string[], fields: string[] = []): Promise<GameApi[]> {
    const idString = ids.join(',');

    let writer = new IGDBRequestBodyWriter();
    writer.field(fields);
    writer.where(`id = (${idString})`);

    const body = writer.writeRequestBody();

    return await this.instance.post('/games', body, {
      headers: {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.token.accessToken}`,
      },
    });
  }
}

class IGDBRequestBodyWriter implements ApiRequestBodyWriter {
  private fields?: string[];
  private searchClause?: string;
  private whereClause?: string[];
  private limitClause: number = 10;
  private offsetClause: number = 0;

  private defaultFields: string[];

  constructor() {
    this.defaultFields = [
      'name',
      'rating',
      'cover.*',
      'url',
      'first_release_date',
    ];
  }

  writeRequestBody(): string {
    if (this.fields === undefined || this.fields.length === 0) {
      this.fields = this.defaultFields;
    }

    let requestBody = '';

    requestBody += `fields ${this.fields}; `;

    if (this.searchClause !== undefined) {
      requestBody += `search "${this.searchClause}"; `;
    }

    if (this.whereClause !== undefined) {
      requestBody += `where ${this.whereClause.join(' & ')}; `;
    }

    requestBody += `limit ${this.limitClause}; offset ${this.offsetClause};`;

    return requestBody;
  }

  field(fieldsToAdd: string | string[]): void {
    if (this.fields === undefined) {
      this.fields = [];
    }

    if (typeof fieldsToAdd === 'string') {
      this.fields.push(fieldsToAdd);
    } else {
      this.fields.push(...fieldsToAdd);
    }
  }

  search(query: string): void {
    this.searchClause = query;
  }

  where(whereClauses: string | string[]): void {
    if (this.whereClause === undefined) {
      this.whereClause = [];
    }

    if (typeof whereClauses === 'string') {
      this.whereClause.push(whereClauses);
    } else {
      this.whereClause.push(...whereClauses);
    }
  }

  limit(limit: number): void {
    this.limitClause = limit;
  }

  offset(offset: number): void {
    this.offsetClause = offset;
  }
}
