import { resolve } from "path";

const file = await Bun.file(resolve(import.meta.dir, "input-2.txt")).text();
const lines = file.split("\n");
const initialCopies = Array.from<number>({ length: lines.length }).fill(1); // start with 1 copy of each card

function processCardWithCopies(card: string, copies: number[]) {
  const [_, cardNumber, numbersString] = card.split(/Card\s+(\d+): /);
  const numbers = numbersString.split(" | ");

  const winningNumbers = [...numbers[0].matchAll(/\d+/g)].flatMap(Number);
  const myWinningNumbers = [...numbers[1].matchAll(/\d+/g)].flatMap(Number).filter((number) => {
    return winningNumbers.includes(number);
  });

  const amountOfNewCopies = myWinningNumbers.length;
  const newCopiesIndices = Array.from({ length: amountOfNewCopies }).map((_, index) => Number(cardNumber) + index);
  const newCopies = copies.map((amount, index) => {
    if (newCopiesIndices.includes(index)) {
      return amount + copies[Number(cardNumber) - 1];
    }
    return amount;
  });

  console.log("new copies", newCopies);
  return newCopies;
}

const copies = lines.reduce((acc, line) => {
  return processCardWithCopies(line, acc);
}, initialCopies);
const sum = copies.reduce((prev, curr) => prev + curr);
console.log("sum", sum);
