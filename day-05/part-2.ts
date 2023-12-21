import { resolve } from "path";

type RangeMap = {
  fromStart: number;
  toStart: number;
  length: number;
};

function inRange(x: number, range: RangeMap) {
  return x >= range.fromStart && x <= range.fromStart + range.length - 1;
}

function parseSeeds(seeds: string) {
  const seedPairs = splitOnNth(seeds, " ", 2);
  return seedPairs.map((pair) => {
    const [start, length] = pair.split(" ").map(Number);
    return { start, length };
  });
}

function applyMaps(x: number, ranges: RangeMap[]) {
  const range = ranges.find((range) => inRange(x, range));
  if (!range) {
    return x;
  }
  const rangeIndex = x - range.fromStart;
  return range.toStart + rangeIndex;
}

function parseMaps(maps: string[]): RangeMap[] {
  return maps.map((map) => {
    const [destinationStart, sourceStart, length] = map.split(" ").map(Number);
    return {
      fromStart: sourceStart,
      toStart: destinationStart,
      length: length,
    };
  });
}

function splitOnNth(str: string, delimiter: string, n: number) {
  var parts = str.split(delimiter);
  var result = [];

  for (var i = 0; i < parts.length; i++) {
    if (i % n === 0) {
      result.push(parts[i]);
    } else {
      result[result.length - 1] += delimiter + parts[i];
    }
  }

  return result;
}

const file = await Bun.file(resolve(import.meta.dir, "input-2.txt")).text();
const [seeds, ...listOfMaps] = file.split("\n\n").map((range) => range.split("\n"));
const parsedSeedNumbers = parseSeeds(seeds[0].split(": ")[1]);
const parsedMaps = listOfMaps.map((maps) => parseMaps(maps.slice(1)));
console.log("seed numbers", parsedSeedNumbers, parsedSeedNumbers.length);
let minLocation = Infinity;
for (const { start, length } of parsedSeedNumbers) {
  for (let seedNumber = start; seedNumber < start + length; seedNumber++) {
    const location = parsedMaps.reduce((acc, maps) => {
      return applyMaps(acc, maps);
    }, seedNumber);
    if (location < minLocation) {
      minLocation = location;
    }
  }
}
console.log("min location", minLocation);
// const locations = seedNumbers.map((seedNumber) => {
//   return parsedMaps.reduce((acc, maps) => {
//     return applyMaps(acc, maps);
//   }, seedNumber);
// });
// const minLocation = locations.reduce((acc, location) => (location < acc ? location : acc));
