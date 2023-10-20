import { js } from "@dunes/tools";
import { JSParser } from "../src/langs/js/index.js";

const loadStart = Date.now();
const jsParser = new JSParser();
const loadTime = Date.now() - loadStart;

try {
  const parseStart = Date.now();
	const result = jsParser.produce(
    'const $ = s`hey man ${myVar} is good! ${james_2}\\\` is an good`', {
      program: {
        sourceType: "esm"
      }
    }
  );
  console.log(js(result.program))
  console.log("Loaded in", loadTime + "ms");
  console.log("Parsed in", Date.now() - parseStart + "ms");

  // result.travel(tr => ({

  //   Identifier(path) {

  //     const fun = tr.read("function() {}", "FunctionExpression");
  //     path.replaceWith(fun)
  //   },



  // }))


  // const code = await result.convertAsync();


}
catch(err) {
	console.log("ERROR")
	console.log(err);
}


process.exit(0);