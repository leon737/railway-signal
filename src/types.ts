export enum HeadType {
  Speed,
  MiniSpeed,
  Route,
  TrackLimit,
  GradeTime,
}

export enum RouteDirection {
  Straight,
  Divert,
}

export interface SpeedLight {
  blocksClear: number;
  canPassRed: boolean;
}

export interface RouteLight {
  direction: RouteDirection;
  isAnnounce: boolean;
}

export interface LightData {
  color: string;
  flashing: boolean;
  out: boolean;
}
