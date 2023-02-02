import { computed, Ref } from "vue";
import {
  HeadType,
  LightData,
  RouteDirection,
  SignalConfig,
  SignalData,
} from "./types";

const RED = "red";
const YELLOW = "yellow";
const GREEN = "#0F0";
const WHITE = "#FFF";

export default function () {
  const getHeads = (config: Ref<SignalConfig>) => {
    return computed(() => {
      const result: HeadType[] = [];
      if (config.value.hasTrackLimitHead) {
        result.push(HeadType.TrackLimit);
        result.push(HeadType.MiniSpeed);
      } else {
        result.push(HeadType.Speed);
      }
      if (config.value.hasRouteHead) {
        result.push(HeadType.Route);
      }
      if (config.value.isRouteAnnouce) {
        result.push(HeadType.RouteAnnouce);
      }
      if (config.value.hasGradeTimerHead || config.value.isGradeTimerAnnounce) {
        result.push(HeadType.GradeTime);
      }
      return result;
    });
  };

  const getHead = (
    headType: Ref<HeadType>,
    config: Ref<SignalConfig>,
    data: Ref<SignalData>
  ) => {
    return computed(() => {
      switch (headType.value) {
        case HeadType.TrackLimit:
          return [
            makeLight(
              RED,
              isTrackLimitRedLightOn(config.value, data.value),
              isTrackLimitRedLightFlashing(config.value)
            ),
          ];
        case HeadType.MiniSpeed:
          return [
            makeLight(
              GREEN,
              isSpeedLightOn(config.value, data.value, 2),
              isSpeedLightFlashing(config.value, data.value, 2)
            ),
            makeLight(
              YELLOW,
              isSpeedLightOn(config.value, data.value, 1),
              isSpeedLightFlashing(config.value, data.value, 1)
            ),
            makeLight(
              RED,
              isSpeedLightOn(config.value, data.value, 0),
              isSpeedLightFlashing(config.value, data.value, 0)
            ),
          ];
        case HeadType.Route:
          return [
            makeLight(
              GREEN,
              isRouteLightOn(config.value, data.value, RouteDirection.Straight),
              isRouteLightFlashing(config.value, RouteDirection.Straight)
            ),
            makeLight(
              YELLOW,
              isRouteLightOn(config.value, data.value, RouteDirection.Divert),
              isRouteLightFlashing(config.value, RouteDirection.Divert)
            ),
            makeLight(
              RED,
              isRouteLightOn(config.value, data.value, RouteDirection.None),
              isRouteLightFlashing(config.value, RouteDirection.None)
            ),
          ];
        case HeadType.RouteAnnouce:
          return [
            makeLight(
              YELLOW,
              isRouteAnnounceLightOn(
                config.value,
                data.value,
                RouteDirection.Divert
              ),
              isRouteAnnounceLightFlashing(
                config.value,
                data.value,
                RouteDirection.Divert
              )
            ),
            makeLight(
              RED,
              isRouteAnnounceLightOn(
                config.value,
                data.value,
                RouteDirection.None
              ),
              isRouteAnnounceLightFlashing(
                config.value,
                data.value,
                RouteDirection.None
              )
            ),
          ];
        case HeadType.Speed:
          return [
            makeLight(
              RED,
              isSpeedLimitExtraRedLightOn(config.value, data.value),
              isSpeedLimitExtraRedLightFlashing()
            ),
            makeLight(
              GREEN,
              isSpeedLightOn(config.value, data.value, 2),
              isSpeedLightFlashing(config.value, data.value, 2)
            ),
            makeLight(
              YELLOW,
              isSpeedLightOn(config.value, data.value, 1),
              isSpeedLightFlashing(config.value, data.value, 1)
            ),
            makeLight(
              RED,
              isSpeedLightOn(config.value, data.value, 0),
              isSpeedLightFlashing(config.value, data.value, 0)
            ),
          ];
        case HeadType.GradeTime:
          return [
            makeLight(
              WHITE,
              isGradeTimeWhiteLightOn(data.value),
              isGradeTimeWhiteLightFlashing(config.value, data.value)
            ),
          ];
      }
    });
  };

  const makeLight = (
    color: string,
    lightOn: boolean = false,
    flashing: boolean = false
  ): LightData => {
    return {
      color,
      out: !lightOn,
      flashing,
    };
  };

  const isTrackLimitRedLightOn = (
    config: SignalConfig,
    data: SignalData
  ): boolean => {
    if (data.blocksClear < 1) {
      return (config.hasGradeTimerHead && data.gradeTimerOn) || data.canPassRed;
    } else {
      return data.slowTrack;
    }
  };

  const isTrackLimitRedLightFlashing = (config: SignalConfig): boolean => {
    return false;
  };

  const isSpeedLightOn = (
    config: SignalConfig,
    data: SignalData,
    index: number
  ): boolean => {
    const blocksClear = config.isBrl
      ? Math.max(Math.min(data.blocksClear, 4), 0)
      : Math.max(Math.min(data.blocksClear, 2), 0);
    if (config.isBrl) {
      return Math.floor(blocksClear / 2) == index;
    } else {
      return blocksClear == index;
    }
  };

  const isSpeedLightFlashing = (
    config: SignalConfig,
    data: SignalData,
    index: number
  ): boolean => {
    if (config.isBrl) {
      if (
        data.blocksClear > 0 &&
        (data.blocksClear > 4 || data.blocksClear % 2 == 1)
      ) {
        return true;
      }
    } else {
      if (index == 2 && data.blocksClear > 2) {
        return true;
      }
    }
    if (
      data.blocksClear < 1 &&
      (data.canPassRed || (config.hasGradeTimerHead && data.gradeTimerOn))
    ) {
      return !!data.canPassRed;
    }
    return false;
  };

  const isSpeedLimitExtraRedLightOn = (
    config: SignalConfig,
    data: SignalData
  ): boolean => {
    if (
      data.blocksClear < 1 &&
      (data.canPassRed || (config.hasGradeTimerHead && data.gradeTimerOn))
    ) {
      return true;
    }
    return false;
  };

  const isSpeedLimitExtraRedLightFlashing = (): boolean => {
    return false;
  };

  const isRouteLightOn = (
    config: SignalConfig,
    data: SignalData,
    direction: RouteDirection
  ): boolean => {
    const canPass = checkCanPass(config, data);
    switch (direction) {
      case RouteDirection.None:
        return data.blocksClear < 1 && !canPass;
      case RouteDirection.Straight:
        return data.direction == RouteDirection.Straight && canPass;
      case RouteDirection.Divert:
        return data.direction == RouteDirection.Divert && canPass;
    }
  };

  const isRouteLightFlashing = (
    config: SignalConfig,
    direction: RouteDirection
  ): boolean => {
    return false;
  };

  const isRouteAnnounceLightOn = (
    config: SignalConfig,
    data: SignalData,
    direction: RouteDirection
  ): boolean => {
    const canPass = checkCanPass(config, data);
    switch (direction) {
      case RouteDirection.None:
        return !data.canPassNextSignal && canPass;
      case RouteDirection.Straight:
        return false;
      case RouteDirection.Divert:
        return (
          data.announceDirection == RouteDirection.Divert &&
          (data.blocksClear > 1 || canPass) &&
          data.canPassNextSignal
        );
    }
  };

  const isRouteAnnounceLightFlashing = (
    config: SignalConfig,
    data: SignalData,
    direction: RouteDirection
  ): boolean => {
    return true;
  };

  const isGradeTimeWhiteLightOn = (data: SignalData): boolean => {
    return (
      (data.gradeTimerOn && data.blocksClear < 2) ||
      (data.announceGradeTimerOn &&
        data.blocksClear > 0 &&
        data.blocksClear < 3)
    );
  };

  const isGradeTimeWhiteLightFlashing = (
    config: SignalConfig,
    data: SignalData
  ): boolean => {
    return (
      config.isGradeTimerAnnounce &&
      data.announceGradeTimerOn &&
      !data.gradeTimerOn
    );
  };

  const checkCanPass = (config: SignalConfig, data: SignalData) => {
    return (
      data.blocksClear > 0 ||
      data.canPassRed ||
      (config.hasGradeTimerHead && data.gradeTimerOn)
    );
  };

  return { getHeads, getHead, checkCanPass };
}
