import { computed, Ref } from "vue";
import {
  HeadType,
  LightData,
  RouteDirection,
  SignalConfig,
  SignalData,
} from "./types";
import { Uniform5Mapping, Uniform5SignalMapping } from "./uniformSignalMapping";

const RED = "red";
const YELLOW = "yellow";
const GREEN = "#0F0";

type Uniform5SignalMappingPredicate = (value: Uniform5SignalMapping) => boolean;

export default function () {
  const getHeads = (config: Ref<SignalConfig>) => {
    return computed(() => {
      return [HeadType.Uniform5];
    });
  };

  const getHead = (
    headType: Ref<HeadType>,
    config: Ref<SignalConfig>,
    data: Ref<SignalData>
  ) => {
    return computed(() => {
      let blocksClear = Math.min(Math.max(data.value.blocksClear, 0), 5);
      let mappings: Uniform5SignalMapping[] = [];
      do {
        mappings = Uniform5Mapping.filter((x) => x.blocks == blocksClear);
        mappings = data.value.canPassRed
          ? fallbackFilter(mappings, (x) => !!x.canPass)
          : mappings;
        mappings =
          data.value.slowTrack && data.value.blocksClear > 1
            ? filter(mappings, (x) => !!x.slow)
            : mappings;
        mappings =
          data.value.direction == RouteDirection.Divert
            ? fallbackFilter(mappings, (x) => !!x.divert)
            : mappings;
        mappings =
          !!data.value.announceBlocksAhead &&
          data.value.announceBlocksAhead < data.value.blocksClear
            ? fallbackFilter(
                mappings,
                (x) => x.announce === data.value.announceBlocksAhead
              )
            : mappings;
        mappings =
          data.value.gradeTimerOn && data.value.blocksClear != 1
            ? fallbackFilter(mappings, (x) => !!x.grade || !!x.timer)
            : mappings;
        if (!mappings.length) {
          blocksClear--;
        }
      } while (!mappings.length && blocksClear >= 0);

      const mapping = mappings.length > 0 ? mappings[0] : Uniform5Mapping[0];
      const code = mapping.code;

      return [
        makeLight(RED, code.charAt(0) != "x", code.charAt(0) == "r"),
        makeLight(YELLOW, code.charAt(1) != "x", code.charAt(1) == "y"),
        makeLight(RED, code.charAt(2) != "x", code.charAt(2) == "r"),
        makeLight(GREEN, code.charAt(3) != "x", code.charAt(3) == "g"),
        makeLight(YELLOW, code.charAt(4) != "x", code.charAt(4) == "y"),
      ];
    });
  };

  const filter = (
    source: Uniform5SignalMapping[],
    predicate: Uniform5SignalMappingPredicate
  ) => {
    const result = source.filter(predicate);
    return result;
  };

  const fallbackFilter = (
    source: Uniform5SignalMapping[],
    predicate: Uniform5SignalMappingPredicate
  ) => {
    const result = source.filter(predicate);
    return result.length ? result : source;
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

  return {
    getHeads,
    getHead,
  };
}
