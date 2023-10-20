import { js } from "@dunes/tools";
import { JSParser } from "../src/langs/js/index.js";
// import { c } from "@dunes/sys"

const loadStart = Date.now();
const jsParser = new JSParser();
const loadTime = Date.now() - loadStart;

// @ts-ignore
// const myFunc = async (n = 5.8, r, ...args) => (44 += 2);
/*class MyDate extends Date {

  #myFunc([x] = () => aa) {

    return true;
  }

}*/

try {
  const parseStart = Date.now();
	const result = jsParser.produce(
   'const $ = `hey man ${myVar} is good! ${james_2}\\\` is an good`' 
  );
  console.log(js(result.program))
  console.log("Loaded in", loadTime + "ms");
  console.log("Parsed in", Date.now() - parseStart + "ms");



  result.travel(tr => ({

    Identifier(path) {
      const fun = tr.read("function() {}", "FunctionExpression");
      path.replaceWith(fun)
    },

    

  }))
}
catch(err) {
	console.log("ERROR")
	console.log(err + " " + js(jsParser.body));
}

/* Cannot use keyword as member expression */
/* Destructuring */

// process.exit(0);


const x = {

  hello: {
    name: 1,
  },

  alone: {
    china: "jsja1",
  },

  wealth: {
    iphone: 2,
  },
}