import { computed, Ref } from "vue";
import { HeadType, LightData, RouteDirection, SignalConfig, SignalData } from "./types";

const RED = 'red'
const YELLOW = 'yellow'
const GREEN = '#0F0'
const WHITE = '#FFF'

export default function() {
    const getHead = (headType: Ref<HeadType>, config: Ref<SignalConfig>, data: Ref<SignalData>) => {
        return computed(() => {
            switch(headType.value) {
                case HeadType.TrackLimit:
                    return [makeLight(RED, isTrackLimitRedLightOn(config.value, data.value), isTrackLimitRedLightFlashing(config.value))]
                case HeadType.MiniSpeed:
                    return [makeLight(GREEN, isSpeedLightOn(data.value, 2), isSpeedLightFlashing(config.value, data.value, 2)), 
                        makeLight(YELLOW, isSpeedLightOn(data.value, 1), isSpeedLightFlashing(config.value, data.value, 1)), 
                        makeLight(RED, isSpeedLightOn(data.value, 0), isSpeedLightFlashing(config.value, data.value, 0))]
                case HeadType.Route:
                    return [makeLight(GREEN, isRouteLightOn(config.value, data.value, RouteDirection.Straight), isRouteLightFlashing(config.value, RouteDirection.Straight)), 
                        makeLight(YELLOW,isRouteLightOn(config.value, data.value, RouteDirection.Divert), isRouteLightFlashing(config.value, RouteDirection.Divert)), 
                        makeLight(RED, isRouteLightOn(config.value, data.value, RouteDirection.None), isRouteLightFlashing(config.value, RouteDirection.None))]
                case HeadType.Speed:
                    return [makeLight(RED, isSpeedLimitExtraRedLightOn(config.value, data.value), isSpeedLimitExtraRedLightFlashing()), 
                        makeLight(GREEN, isSpeedLightOn(data.value, 2), isSpeedLightFlashing(config.value, data.value, 2)), 
                        makeLight(YELLOW, isSpeedLightOn(data.value, 1), isSpeedLightFlashing(config.value, data.value, 1)), 
                        makeLight(RED, isSpeedLightOn(data.value, 0), isSpeedLightFlashing(config.value, data.value, 0))]
                case HeadType.GradeTime:
                    return [makeLight(WHITE, isGradeTimeWhiteLightOn(data.value), isGradeTimeWhiteLightFlashing(config.value))]
            }
        })
    }

    const makeLight = (color: string, lightOn: boolean = false, flashing: boolean = false): LightData => {
        return {
            color,
            out: !lightOn,
            flashing
        }
    }

    const isTrackLimitRedLightOn = (config: SignalConfig, data: SignalData): boolean => {
        if (data.blocksClear < 1) {
            return ((config.hasGradeTimerHead && data.gradeTimerOn) || data.canPassRed) && !config.isRepeater;
        } else {
            return data.slowTrack;
        }
    }

    const isTrackLimitRedLightFlashing = (config: SignalConfig): boolean => {
        return config.isRepeater
    }

    const isSpeedLightOn = (data: SignalData, index: number): boolean => {
        const blocksClear = Math.max(Math.min(data.blocksClear, 2), 0)
        return blocksClear == index
    }

    const isSpeedLightFlashing = (config: SignalConfig, data: SignalData, index: number): boolean => {
        if (index == 2 && data.blocksClear > 2) {
            return true
        }
        if (data.blocksClear < 1 && !config.isRepeater && (data.canPassRed || (config.hasGradeTimerHead && data.gradeTimerOn))) {
            return !!data.canPassRed
        }
        return config.isRepeater && data.blocksClear != 2
    }

    const isSpeedLimitExtraRedLightOn = (config: SignalConfig, data: SignalData): boolean => {
        if (data.blocksClear < 1 && !config.isRepeater && (data.canPassRed || (config.hasGradeTimerHead && data.gradeTimerOn))) {
            return true
        }
        return false
    }

    const isSpeedLimitExtraRedLightFlashing = (): boolean => {
        return false
    }

    const isRouteLightOn = (config: SignalConfig, data: SignalData, direction: RouteDirection): boolean => {
        const canPass = data.canPassRed || (config.hasGradeTimerHead && data.gradeTimerOn)
        switch(direction) {
            case RouteDirection.None:
                return  data.blocksClear < 1 && !canPass
            case RouteDirection.Straight:
                return data.direction == RouteDirection.Straight && !config.isRouteAnnouce && (data.blocksClear > 0 || canPass)
            case RouteDirection.Divert:
                return data.direction == RouteDirection.Divert && (data.blocksClear > 0 || canPass)
        }
    }

    const isRouteLightFlashing = (config: SignalConfig, direction: RouteDirection): boolean => {
        return config.isRouteAnnouce && direction != RouteDirection.None
    }

    const isGradeTimeWhiteLightOn = (data: SignalData): boolean => {
        return data.gradeTimerOn && data.blocksClear < 2
    }

    const isGradeTimeWhiteLightFlashing = (config: SignalConfig): boolean => {
        return config.isGradeTimerAnnounce
    }



    return {getHead}
}