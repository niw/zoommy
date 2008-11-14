load("build/writeFile.js");
load("build/base2.js");
load("build/Packer.js");
load("build/Words.js");

// arguments
var inFile = arguments[0];
var outFile = arguments[1] || inFile.replace(/\.js$/, ".pack.js");

// options
var base62 = true;
var shrink = true;

var script = readFile(inFile);
var header = script.match(/\/\*(.|\n|\r)*?\*\//)[0];
var packer = new Packer;
var packedScript = packer.pack(script, base62, shrink);

writeFile(outFile, header + "\n" + packedScript);
