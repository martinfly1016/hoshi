import {
  DefaultEightCharProvider,
  LunarHour,
  LunarSect2EightCharProvider,
  SolarTime,
} from "tyme4ts";
import { Solar as LunarJsSolar } from "lunar-javascript";
import { Solar as LunarTsSolar } from "lunar-typescript";

const boundarySamples = [
  { id: "Z001", input: { year: 1988, month: 2, day: 15, hour: 22, minute: 30, second: 0 } },
  { id: "Z002", input: { year: 1988, month: 2, day: 15, hour: 23, minute: 0, second: 0 } },
  { id: "Z003", input: { year: 1988, month: 2, day: 15, hour: 23, minute: 30, second: 0 } },
  { id: "Z004", input: { year: 1988, month: 2, day: 16, hour: 0, minute: 30, second: 0 } },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatInput(input) {
  return `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(input.minute)}:${pad(input.second)}`;
}

function formatTyme(eightChar) {
  return [
    eightChar.getYear(),
    eightChar.getMonth(),
    eightChar.getDay(),
    eightChar.getHour(),
  ].map((p) => p.toString()).join(" / ");
}

function formatLunar(eightChar) {
  return [
    eightChar.getYear(),
    eightChar.getMonth(),
    eightChar.getDay(),
    eightChar.getTime(),
  ].join(" / ");
}

function tymeSixtyCycle(input) {
  const time = SolarTime.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, input.second);
  return formatTyme(time.getSixtyCycleHour().getEightChar());
}

function tymeLunarHour(input, provider) {
  LunarHour.provider = provider;
  const time = SolarTime.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, input.second);
  return formatTyme(time.getLunarHour().getEightChar());
}

function lunarWithSect(SolarClass, input, sect) {
  const eightChar = SolarClass
    .fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, input.second)
    .getLunar()
    .getEightChar();
  eightChar.setSect(sect);
  return formatLunar(eightChar);
}

const results = boundarySamples.map((sample) => ({
  id: sample.id,
  input: formatInput(sample.input),
  tymeSixtyCycleHour: tymeSixtyCycle(sample.input),
  tymeLunarDefault: tymeLunarHour(sample.input, new DefaultEightCharProvider()),
  tymeLunarSect2: tymeLunarHour(sample.input, new LunarSect2EightCharProvider()),
  lunarJavascriptSect1: lunarWithSect(LunarJsSolar, sample.input, 1),
  lunarJavascriptSect2: lunarWithSect(LunarJsSolar, sample.input, 2),
  lunarTypescriptSect1: lunarWithSect(LunarTsSolar, sample.input, 1),
  lunarTypescriptSect2: lunarWithSect(LunarTsSolar, sample.input, 2),
}));

console.log(JSON.stringify({
  rule: "late-zi-hour-day-boundary",
  note: "sect1 / DefaultEightCharProvider treats 23:00 as next day; sect2 / LunarSect2EightCharProvider keeps day pillar unchanged after 23:00.",
  results,
}, null, 2));
