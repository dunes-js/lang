import { js } from "@dunes/tools";
import { JSParser } from "../src/langs/js";
import { c } from "@dunes/sys"


const jsParser = new JSParser();

try {
	const result = jsParser.produce(`

    const n = 88, [myVar, {user = 22}] = 22;

	 `);

  c.log(result.program)
}
catch(err) {
	c.red.log("ERROR")
	c.gray.log(err + " " + js(jsParser.body));
}

/* Cannot use keyword as member expression */
/* Destructuring */

process.exit(0);