import { resolve } from "path";

type Match = {
  match: string;
  indexStart: number;
  indexEnd: number;
};

type GlobalMatch = {
  number: number;
  x: number;
  y: number;
};

type Result = {
  [key: string]: number[];
};

function parseMatch(match: RegExpMatchArray) {
  return {
    match: match[0],
    indexStart: match.index!,
    indexEnd: match.index! + match[0].length - 1,
  };
}

function locateNumbers(line: string) {
  const regex = /\d+/g;
  let matches = [...line.matchAll(regex)].map(parseMatch);
  return matches;
}

function convertMatchesToGlobal(
  number: number,
  matches: Match[],
  globalXStart: number,
  globalY: number
): GlobalMatch[] {
  return matches.map(({ match, indexStart }) => ({
    number,
    x: globalXStart + indexStart,
    y: globalY,
  }));
}

function processLine(line: string, lineIdx: number, prevLine: string | undefined, nextLine: string | undefined) {
  const numbers = locateNumbers(line);

  return numbers.flatMap((number) => {
    const starRegex = /\*/g;
    const xOffset = Math.max(number.indexStart - 1, 0);
    const num = Number(number.match);

    const charsAbove = prevLine && prevLine.substring(number.indexStart - 1, number.indexEnd + 2);
    const matchesAbove = charsAbove != null ? [...charsAbove.matchAll(starRegex)].map(parseMatch) : [];
    const globalMatchesAbove = convertMatchesToGlobal(num, matchesAbove, xOffset, lineIdx - 1);

    const charsBelow = nextLine && nextLine.substring(number.indexStart - 1, number.indexEnd + 2);
    const matchesBelow = charsBelow != null ? [...charsBelow.matchAll(starRegex)].map(parseMatch) : [];
    const globalMatchesBelow = convertMatchesToGlobal(num, matchesBelow, xOffset, lineIdx + 1);

    const leftIndex = Math.max(number.indexStart - 1, 0);
    const charLeft = line.at(leftIndex);
    const globalMatchLeft: GlobalMatch[] = charLeft !== "*" ? [] : [{ number: num, x: leftIndex, y: lineIdx }];

    const rightIndex = Math.min(number.indexEnd + 1, line.length - 1);
    const charRight = line.at(rightIndex);
    const globalMatchRight: GlobalMatch[] = charRight !== "*" ? [] : [{ number: num, x: rightIndex, y: lineIdx }];

    return [...globalMatchesAbove, ...globalMatchesBelow, ...globalMatchLeft, ...globalMatchRight];
  });
}

const file = await Bun.file(resolve(import.meta.dir, "input.txt")).text();
const lines = file.split("\n");

const matches = lines.flatMap((line, lineIndex) => {
  const prevLine = lineIndex === 0 ? undefined : lines[lineIndex - 1];
  const nextLine = lineIndex === lines.length - 1 ? undefined : lines[lineIndex + 1];
  return processLine(line, lineIndex, prevLine, nextLine);
});

const matchToNumberMap = matches.reduce<Result>((acc, match) => {
  const matchId = `${match.x}.${match.y}`;
  const prevNumbers = acc[matchId] as number[] | undefined;
  if (!prevNumbers) {
    acc[matchId] = [match.number];
  } else {
    acc[matchId] = [...prevNumbers, match.number];
  }
  return acc;
}, {});
console.log(matchToNumberMap);

const gearRatiosSum = Object.values(matchToNumberMap)
  .filter((numbers) => numbers.length === 2)
  .map((numbers) => numbers.reduce((prev, curr) => prev * curr, 1))
  .reduce((prev, gearRatio) => prev + gearRatio, 0);

console.log(gearRatiosSum);
