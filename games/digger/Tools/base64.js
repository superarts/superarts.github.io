
var fs = require("fs");

var arguments = process.argv.splice(2);

if (arguments.length < 3)
{
	console.log("JavaScript Base64 Resource Converter, Version 1.0");
 	console.log("Converts binary files to JavaScript base64 array and appends to output file.");
 	console.log();
	console.log("Usage: node base64.js <output.js> <javascript-variable> <file1> <file2> ...");
 	console.log();
	return;
}

var targetPath = arguments[0];

var targetFile = fs.openSync(arguments[0], "a", 666);

fs.writeSync(targetFile, arguments[1], null, "utf-8");
fs.writeSync(targetFile, " = [ ", null, "utf-8");

for (var i = 2; i < arguments.length; i++)
{
	if (i !== 2)
	{
		fs.writeSync(targetFile, ", ", null, "utf-8");
	}

	var data = fs.readFileSync(arguments[i]);
	var text = data.toString("base64");
	fs.writeSync(targetFile, '"' + text + '"', null, "utf-8");
}

fs.writeSync(targetFile, " ];\n\r", null, "utf-8");
fs.closeSync(targetFile);
