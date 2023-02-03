export enum HeadType {
  Speed,
  MiniSpeed,
  Route,
  RouteAnnouce,
  TrackLimit,
  GradeTime,
  Uniform5
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
  isBrl: boolean;
  isUniform: boolean;
  isUniformSmart: boolean;
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
  announceGradeTimerOn: boolean;
  announceDirection: RouteDirection;
  canPassNextSignal: boolean;
}
