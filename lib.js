const _ = require('lodash');
const corpora = require('corpora-project');
const luxon = require('luxon');
const tracery = require('tracery-grammar');
const st = require('js-st');

const places = _.flatMap(
  corpora.getFile('geography', 'venues').categories,
  c => _.flatMap(c.categories, x => x.name));

const g = {
  'name': ['A.', 'B.', 'C.', 'D.', 'E.', 'F.',
           'G.', 'H.', 'I.', 'J.', 'K.', 'L.',
           'M.', 'N.', 'O.', 'P.', 'Q.', 'R.',
           'S.', 'T.', 'U.', 'V.', 'W.', 'X.',
           'Y.', 'Z.'],
  'mood': corpora.getFile('humans', 'moods').moods,
  'place': places,
  'adj': corpora.getFile('words', 'adjs').adjs,
  'remark': [' I wonder what\'s going on...',
             ' Could a new romance be afoot?',
             '..that\'s unexpected...',
             '..but you didn\'t hear it from me...',
             '..watch this space for further developments.',
             '..stay tuned...',
             '', ''],
  'n': ['#name# was', '#name# & #name# were'],
  'v': ['seen ', 'spotted ', ''],
  'src': ['A little birdy told me',
          'My sources report',
          'I heard through the grapevine',
          'Everyone is saying',
          'I have it on good authority that',
          'Did you hear?',
          'I heard through the grapevine that',
          'Multiple sources confirm',
          'My dog told me'], 
  'det': ['the #adj#', '#adj.a#'],
  'app': [', looking #mood#.', '.'],
  'origin': ['#src# #n# #v#at #det# #place##app##remark#']
};
const grammar = tracery.createGrammar(g);
grammar.addModifiers(tracery.baseEngModifiers);

const genLine = () => grammar.flatten('#origin#');
const logLine = () => console.log(genLine())

function randInt(lo, hi) {
  if (typeof hi === 'undefined') {
    hi = lo;
    lo = 0;
  };
  let rng = hi - lo;
  return Math.random() * rng + lo;
}

function doRandTimes(lo, hi, f) {
  if (typeof hi === 'function' &&
      typeof f === 'undefined') {
    f = hi;
    hi = lo;
    lo = 0;
  };
  let i = 0;
  for (i; i < hi; i++) {
    f()
  }
}

function ordToDate(o) {
  // o = {year: int, ordinal: int}
  let d = luxon.DateTime.fromObject(o);
  return d.setLocale('EN')
          .toLocaleString({day: 'numeric', month: 'long'})
}

function daysWorth({o, g, w, t}) {
  let ordn = o.ordinal + randInt(1, 15);
  if (ordn > 365) {
    o.ordinal = ordn - 365;
    o.year += 1;
  } else {
    o.ordinal = ordn;
  }
  g.push(ordToDate(o));
  doRandTimes(2, 8, () => {
    let ng = genLine();
    let l = ng.length;
    if (l > w) {
      w = l;
    };
    t += _.words(ng).length;
    g.push(ng);
  })
  g.push('\n');
  return {o, g, w, t}
}

const finish = ({g, w}) => {
  return _.reduce(g, (a, v) => `${a}${_.pad(v, w)}\n`, '')
}

const go = (s, mx) => st(s, daysWorth, v => v.t >= mx, finish);


module.exports = { go }
