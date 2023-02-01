export enum HeadType {
  Speed,
  MiniSpeed,
  Route,
  TrackLimit,
  GradeTime,
}

export enum RouteDirection {
  None,
  Straight,
  Divert,
}

export interface LightData {
  color: string;
  flashing: boolean;
  out: boolean;
}

export interface SignalConfig {
  isRepeater: boolean;
  hasRouteHead: boolean;
  isRouteAnnouce: boolean;
  isGradeTimerAnnounce: boolean;
  hasTrackLimitHead: boolean;
  hasGradeTimerHead: boolean;
  sign: string;
}

export interface SignalData {
  blocksClear: number;
  canPassRed: boolean;
  direction: RouteDirection;
  gradeTimerOn: boolean;
  slowTrack: boolean;
}
