export interface MediaDB {
  id?: number;
  source_name?: string;
  source_api_title?: string;
  source_api_id?: string;
  source_api_url?: string;
  source_webpage_url?: string;
  type?: string;
}

// api returns id as numbers
// lesson learned here: always type this according to the api types
export interface GameApi {
  id: number;
  name: string;
  rating?: number;
  cover?: GameCover;
  url?: string;
  first_release_date?: number;
}

interface GameCover {
  alpha_channel?: boolean;
  animated?: boolean;
  checksum?: string;
  game?: number;
  height?: number;
  image_id?: number;
  url: string;
  width?: number;
}
