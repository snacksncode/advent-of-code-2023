import { resolve } from "path";

function parseLine(line: string) {
  const regex = /\d/g;
  const matches = [...line.matchAll(regex)].flat();
  const firstNumber = matches.at(0)!;
  const lastNumber = matches.at(-1)!;
  const number = Number(`${firstNumber}${lastNumber}`);
  return number;
}

const file = await Bun.file(resolve(import.meta.dir, "input.txt")).text();
const lines = file.split("\n");
const sum = lines.reduce((prev, curr) => {
  return prev + parseLine(curr);
}, 0);
console.log(sum);
