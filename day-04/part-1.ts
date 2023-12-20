import { resolve } from "path";

const file = await Bun.file(resolve(import.meta.dir, "input-2.txt")).text();
const lines = file.split("\n");
const sum = lines.reduce((acc, line) => {
  const numbers = line.split(/Card\s+\d+: /)[1].split(" | ");
  const winningNumbers = [...numbers[0].matchAll(/\d+/g)].flatMap(Number);
  const myWinningNumbers = [...numbers[1].matchAll(/\d+/g)].flatMap(Number).filter((number) => {
    return winningNumbers.includes(number);
  });
  const cardPoints = myWinningNumbers.length > 0 ? 2 ** Math.max(myWinningNumbers.length - 1, 0) : 0;
  return acc + cardPoints;
}, 0);
console.log("sum", sum);
