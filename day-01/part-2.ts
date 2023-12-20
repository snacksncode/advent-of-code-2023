import { resolve } from "path";

function parseMatch(match: string) {
  if (!Number.isNaN(Number(match))) {
    return Number(match);
  }

  if (match === "one") return 1;
  if (match === "two") return 2;
  if (match === "three") return 3;
  if (match === "four") return 4;
  if (match === "five") return 5;
  if (match === "six") return 6;
  if (match === "seven") return 7;
  if (match === "eight") return 8;
  if (match === "nine") return 9;

  throw Error("unreachable");
}

function parseLine(line: string) {
  const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
  const matches = [...line.matchAll(regex)].flat().filter(Boolean);
  const firstNumber = parseMatch(matches.at(0)!);
  const lastNumber = parseMatch(matches.at(-1)!);
  const number = Number(`${firstNumber}${lastNumber}`);
  return number;
}

const file = await Bun.file(resolve(import.meta.dir, "input.txt")).text();
const lines = file.split("\n");
const sum = lines.reduce((prev, curr) => {
  return prev + parseLine(curr);
}, 0);
console.log(sum);
