import { computed, Ref } from "vue";
import { RouteDirection, SignalConfig, SignalData } from "./types";
import useSignal from "./useSignal";

export interface GetSignalConfigOptions {
    signalType: Ref<string>
    isUniform: Ref<boolean>
    signalsCount: Ref<number>
}

export interface GetSignalConfigSettings {
    hasRouteHead: Ref<boolean[]>
    hasTrackLimitHead: Ref<boolean[]>
    hasGradeTimerHead: Ref<boolean[]>
    blocked: Ref<boolean[]>
    canPassRed: Ref<boolean[]>
    diversion: Ref<boolean[]>
    gradeTimerOn: Ref<boolean[]>
    slowTrack: Ref<boolean[]>
}

export default function(options: GetSignalConfigOptions, settings: GetSignalConfigSettings) {

    const { checkCanPass } = useSignal();

    function getSignalConfigs() {
        return computed(() => {
        const model: SignalConfig = {
            isBrl: options.signalType.value == 'brl',
            isUniform: options.isUniform.value,
            isUniformSmart: options.signalType.value == 'uniformSmart',
            hasRouteHead: false,
            isRouteAnnouce: false,
            isGradeTimerAnnounce: false,
            hasTrackLimitHead: false,
            hasGradeTimerHead: false,
            sign: ""
          };
        
          const result: SignalConfig[] = [];
          for (let i = 0; i < options.signalsCount.value; ++i) {
            result.push({
              ...model,
              hasRouteHead: settings.hasRouteHead.value[i],
              hasTrackLimitHead: settings.hasTrackLimitHead.value[i],
              hasGradeTimerHead: settings.hasGradeTimerHead.value[i],
              isRouteAnnouce: settings.hasRouteHead.value[i + 1],
              isGradeTimerAnnounce: settings.hasGradeTimerHead.value[i + 1],
              sign:
                (settings.hasRouteHead.value[i + 1] ? "A" : "") +
                (settings.hasGradeTimerHead.value[i + 1] ? "S" : ""),
            });
          }
          return result;
        })
    }

    function getSignalData(signals: Ref<SignalConfig[]>) {
        return computed(() => {
            const getBlocksAhead = (blocked: boolean[], index: number) => {
                let result = 0;
                for (let i = index; i <= options.signalsCount.value; ++i) {
                  if (blocked[i]) {
                    break;
                  }
                  result++;
                }
                return result;
              };
            
              const result: SignalData[] = [];
              for (let i = 0; i < signals.value.length; ++i) {
                const blocksAhead = getBlocksAhead(settings.blocked.value, i);
                result.push({
                  blocksClear: blocksAhead,
                  canPassRed: settings.canPassRed.value[i],
                  direction: settings.diversion.value[i]
                    ? RouteDirection.Divert
                    : RouteDirection.Straight,
                  announceDirection: signals.value[i].isRouteAnnouce
                    ? settings.diversion.value[i + 1]
                      ? RouteDirection.Divert
                      : RouteDirection.Straight
                    : RouteDirection.None,
                  gradeTimerOn: settings.gradeTimerOn.value[i],
                  slowTrack: settings.slowTrack.value[i],
                  announceGradeTimerOn: signals.value[i].isGradeTimerAnnounce
                    ? settings.gradeTimerOn.value[i + 1]
                    : false,
                  canPassNextSignal: false,
                  announceBlocksAhead: null
                });
              }
              for (let i = 0; i < result.length - 1; ++i) {
                result[i].canPassNextSignal = checkCanPass(
                  signals.value[i + 1],
                  result[i + 1]
                );
              }
                let announceBlocksAhead = -1
                for (let i = options.signalsCount.value - 1; i >= 0; --i) {
                    const signal = signals.value[i]
                    const data = result[i]
                    if (data.direction == RouteDirection.Divert) {
                        announceBlocksAhead = 0
                    }
                    else {
                    if (announceBlocksAhead >=0) {
                        announceBlocksAhead++
                        data.announceBlocksAhead = announceBlocksAhead
                    }
                    }
                                
                }
              return result;
        })
    }

    return {
        getSignalConfigs,
        getSignalData
    }

}