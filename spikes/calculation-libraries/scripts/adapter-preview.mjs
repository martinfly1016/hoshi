import {
  DefaultEightCharProvider,
  LunarHour,
  LunarSect2EightCharProvider,
  SolarTime,
} from "tyme4ts";

const lateZiHourModes = {
  next_day: new DefaultEightCharProvider(),
  same_day: new LunarSect2EightCharProvider(),
};

const samples = [
  { id: "Z002", input: { year: 1988, month: 2, day: 15, hour: 23, minute: 0, second: 0 } },
  { id: "Z003", input: { year: 1988, month: 2, day: 15, hour: 23, minute: 30, second: 0 } },
];

function calculateWithTyme(input, options) {
  if (!options?.lateZiHourMode || options.lateZiHourMode === "pending") {
    return {
      ok: false,
      warning: "LATE_ZI_HOUR_RULE_PENDING",
      message: "lateZiHourMode must be confirmed before calculating 23:00-23:59 boundary cases.",
    };
  }

  LunarHour.provider = lateZiHourModes[options.lateZiHourMode];

  const time = SolarTime.fromYmdHms(
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.second,
  );
  const eightChar = time.getLunarHour().getEightChar();
  const pillars = {
    year: eightChar.getYear().toString(),
    month: eightChar.getMonth().toString(),
    day: eightChar.getDay().toString(),
    hour: eightChar.getHour().toString(),
  };

  return {
    ok: true,
    engine: "tyme4ts",
    options,
    pillars,
  };
}

const result = samples.map((sample) => ({
  id: sample.id,
  nextDay: calculateWithTyme(sample.input, { lateZiHourMode: "next_day" }),
  sameDay: calculateWithTyme(sample.input, { lateZiHourMode: "same_day" }),
  pending: calculateWithTyme(sample.input, { lateZiHourMode: "pending" }),
}));

console.log(JSON.stringify(result, null, 2));
