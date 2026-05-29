import { calculateShichusuimei, FIXTURES } from "../../../site3/calculation-lab.js";

const baseInput = {
  timeKnown: true,
  time: "12:00",
  timeCalculationMode: "standard_time",
  lateZiHourMode: "same_day",
  locationId: "tokyo",
};

const explicitCases = [
  ...FIXTURES.map((fixture) => ({
    id: fixture.id,
    input: fixture.input,
    expectedStatus: fixture.expected.strengthStatus,
  })),
  {
    id: "STRONG-EARTH-1980-02-15",
    input: { ...baseInput, date: "1980-02-15" },
    expectedStatus: "身強",
  },
  {
    id: "EXTREME-WOOD-1992-12-25",
    input: { ...baseInput, date: "1992-12-25" },
    expectedStatus: "極強",
  },
  {
    id: "FOLLOW-WATER-1988-08-05",
    input: { ...baseInput, date: "1988-08-05" },
    expectedStatus: "従格",
  },
];

const failures = [];

for (const testCase of explicitCases) {
  const result = calculateShichusuimei(testCase.input);
  const actual = result.strength?.status;
  if (testCase.expectedStatus && actual !== testCase.expectedStatus) {
    failures.push(`${testCase.id}: expected ${testCase.expectedStatus}, got ${actual}`);
  }
}

const distribution = {};
for (let year = 1980; year <= 2030; year += 2) {
  for (let month = 1; month <= 12; month += 1) {
    for (const day of [5, 15, 25]) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const result = calculateShichusuimei({ ...baseInput, date });
      const status = result.strength?.status || "UNKNOWN";
      distribution[status] = (distribution[status] || 0) + 1;
    }
  }
}

for (const required of ["身強", "中和", "身弱"]) {
  if (!distribution[required]) {
    failures.push(`distribution missing ${required}: ${JSON.stringify(distribution)}`);
  }
}

if ((distribution["身弱"] || 0) + (distribution["従格"] || 0) === Object.values(distribution).reduce((sum, value) => sum + value, 0)) {
  failures.push(`distribution collapsed to weak/follower only: ${JSON.stringify(distribution)}`);
}

console.log("strength distribution", distribution);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("strength regression passed");
