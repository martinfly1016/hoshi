const modules = [
  ["tyme4ts", await import("tyme4ts")],
  ["lunar-javascript", await import("lunar-javascript")],
  ["lunar-typescript", await import("lunar-typescript")],
];

for (const [name, mod] of modules) {
  console.log(`\n# ${name}`);
  console.log(Object.keys(mod).sort().join(", "));
}
