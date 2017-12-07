## Contents  
1. [Fuzzy search in an array of strings](#p1)  
2. [Fuzzy search in an array of objects with nested strings](#p2)  
3. [Fuzzy comparing of strings](#p3)  

<a name="p1"><h4>1. Fuzzy search in an array of strings</h4></a>
```js
const SearchEngine = require('fuzzy-search-and-comparison').SearchEngine;
let searchEngine = new SearchEngine();

// Define the names array
let names = [
  "Tiffany Ellis", "Jon Mcdaniel", "Marcella Bailey",
  "Earnest Hicks", "Christian Mclaughlin", "Martin Baker",
  "Jodi Hogan", "Willie Estrada", "Joe King",
  "Irene Hall", "Leo Wilkerson", "Dominick Weber",
  "Elena Perry", "Kristy Gibson", "James Cunningham",
  "Tina Ross", "Beulah Mccarthy", "Carlos Wallace",
  "Doris Barker", "Josephine Gibbs", "Erik Wells",
  "Elsie Erickson", "Jerald Adkins", "Alfred Huff",
  "Blanche Holt", "Elvira Wright", "Kenneth Fitzgerald",
  "Joan Robinson", "Melissa Tucker", "Evelyn Clark",
  "Gerald Perkins", "Johnny Burton", "Hector Herrera",
  "Gayle Williams", "Bernice Harrington", "Timmy Brady",
  "Jennie Moss", "May Greer", "Thelma Lloyd",
  "Ida Craig", "June Hughes", "Beverly Graves",
  "Alfonso Ramos", "Cecilia Colon", "Ed Barnes",
  "Ken Zimmerman", "Nora Hunter", "Seth Harris",
  "Kristina Rivera", "Archie Brown"
];

// Set count of required results (3 by default)
searchEngine.setStackMaxLength(5);

// Searching of names similar to "Jonh Baker" in the names array
console.log(
  searchEngine.search("John Baker", names)
);

/*
[ { sample_string: 'John Baker',
    tested_string: 'Martin Baker',
    pattern: '*n Baker',
    symbols: 7,
    gaps: 1 },
  { sample_string: 'John Baker',
    tested_string: 'Doris Barker',
    pattern: '*o* Ba*ker',
    symbols: 7,
    gaps: 3 },
  { sample_string: 'John Baker',
    tested_string: 'Johnny Burton',
    pattern: 'John* B*r*',
    symbols: 7,
    gaps: 3 },
  { sample_string: 'John Baker',
    tested_string: 'Jon Mcdaniel',
    pattern: 'Jo*n *a*e*',
    symbols: 6,
    gaps: 4 },
  { sample_string: 'John Baker',
    tested_string: 'Joan Robinson',
    pattern: 'Jo*a*n *',
    symbols: 5,
    gaps: 3 } ]
*/

```

<a name="p2"><h4>2. Fuzzy search in an array of objects with nested strings</h4></a>
```js
let nestedNames = [
  {name: "Tiffany Ellis"},
  {name: "Jon Mcdaniel"},
  {name: "Marcella Bailey"},
  {name: "Earnest Hicks"},
  {name: "Christian Mclaughlin"},
  {name: "Martin Baker"},
  {name: "Jodi Hogan"},
  {name: "Willie Estrada"},
  {name: "Joe King"},
  {name: "Irene Hall"}
];

// Set count of required results (3 by default)
searchEngine.setStackMaxLength(1);

// Searching of names similar to "Jonh Baker" in the names array (callback
// extracts name from an object)
console.log(
  searchEngine.search("Martin Bailey", nestedNames, (item) => {
    return item.name;
  })
);

/*
[ { sample_string: 'Martin Bailey',
    tested_string: 'Marcella Bailey',
    pattern: 'Mar* Bailey',
    symbols: 10,
    gaps: 1 } ]
*/
```

<a name="p3"><h4>3. Fuzzy comparing of strings</h4></a>
```js
const StringsComparator = require('fuzzy-search-and-comparison').StringsComparator;
let stringsComparator = new StringsComparator();

// full view
console.log(
  stringsComparator.compare('contact', 'contract')
);

console.log(
  stringsComparator.compare('modification', 'modernization')
);

// simplified view
console.log(
  stringsComparator.compare('contact', 'contract', true)
);

console.log(
  stringsComparator.compare('modification', 'modernization', true)
);

/*
cont[|r]act
mod[|ern]i[fic|z]ation
cont*act
mod*i*ation
*/
```
