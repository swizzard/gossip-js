const fs = require('fs');
const go = require('./lib').go;

function main() {
  const args = process.argv.slice(2);
  let outFile = 'out.txt';
  let mx = 50000;
  if (typeof args[0] !== 'undefined') {
    outFile = args[0];
  }
  if (typeof args[1] !== 'undefined') {
    mx = parseInt(args[1]);
  }
  const start = {o: {year: 2017, ordinal: 0},
                 g: [],
                 w: 0,
                 t: 0};
  fs.writeFile(outFile, go(start, mx),
               (err) => {if (err) throw err;
                         console.log(`wrote to ${outFile}`)});
}
main();
