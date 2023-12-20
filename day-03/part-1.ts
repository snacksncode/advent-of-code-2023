import { resolve } from "path";

function parseMatch(match: RegExpMatchArray) {
  return {
    number: match[0],
    indexStart: match.index!,
    indexEnd: match.index! + match[0].length - 1,
  };
}

function locateNumbers(line: string) {
  const regex = /\d+/g;
  let matches = [...line.matchAll(regex)].map(parseMatch);
  return matches;
}

function processLine(line: string, prevLine: string | undefined, nextLine: string | undefined) {
  const numbers = locateNumbers(line);

  return numbers
    .filter((number) => {
      const allDotsRegex = /^\.+$/;
      const charsAbove = prevLine && prevLine.substring(number.indexStart - 1, number.indexEnd + 2);
      if (charsAbove && !charsAbove.match(allDotsRegex)) {
        console.log("checking number", number.number, "is part A");
        return true;
      }

      const charsBelow = nextLine && nextLine.substring(number.indexStart - 1, number.indexEnd + 2);
      if (charsBelow && !charsBelow.match(allDotsRegex)) {
        console.log("checking number", number.number, "is part B");
        return true;
      }

      const charLeft = line[number.indexStart - 1] as string | undefined;
      if (charLeft && !charLeft.match(allDotsRegex)) {
        console.log("checking number", number.number, "is part C");
        return true;
      }

      const charRight = line[number.indexEnd + 1] as string | undefined;
      if (charRight && !charRight.match(allDotsRegex)) {
        console.log("checking number", number.number, "is part D");
        return true;
      }

      console.log("checking number", number.number, "is NOT part");
      return false;
    })
    .reduce((prev, curr) => prev + Number(curr.number), 0);
}

const file = await Bun.file(resolve(import.meta.dir, "input.txt")).text();
const lines = file.split("\n");
const sum = lines.reduce((prev, line, lineIndex) => {
  const prevLine = lineIndex === 0 ? undefined : lines[lineIndex - 1];
  const nextLine = lineIndex === lines.length - 1 ? undefined : lines[lineIndex + 1];
  return prev + processLine(line, prevLine, nextLine);
}, 0);
console.log("Sum:", sum);
