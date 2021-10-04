// api returns id as numbers
// lesson learned here: always type this according to the api types
export interface GameApiDto {
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
