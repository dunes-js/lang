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
	const result = jsParser.produce(`
    void async function () {
      if (myName >= 22) {
        for (const every of all) {
          for (;n + 1; n --) {
            return new Mono("Jajajajajaja!")
          }
        }
      }
      else {
        if (all) {

        }
        else if ((22, 2, 1)) {

        }
        else {
          switch (hello > 2) {
            case "jajaja":
            case "wollolwo": {
              
            }
            default: false;
          }
        }
      }
    }()
  `);
  console.log(js(result.program))
  console.log("Loaded in", loadTime + "ms");
  console.log("Parsed in", Date.now() - parseStart + "ms");
}
catch(err) {
	console.log("ERROR")
	console.log(err + " " + js(jsParser.body));
}

/* Cannot use keyword as member expression */
/* Destructuring */

process.exit(0);