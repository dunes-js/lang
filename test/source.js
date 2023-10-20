import { js } from "@dunes/tools";
import { JSParser } from "../src/langs/js/index.js";
import { readFileSync } from "fs";

const loadStart = Date.now();
const jsParser = new JSParser();
const loadTime = Date.now() - loadStart;

try {
  const parseStart = Date.now();
  const source = readFileSync("test/index.ts").toString("utf8");
  const result = jsParser.produce(source);
  console.log(js(result.program))
  console.log("Loaded in", loadTime + "ms");
  console.log("Parsed in", Date.now() - parseStart + "ms");



}
catch(err) {
  console.log("ERROR")
  console.log(err);
}


process.exit(0);