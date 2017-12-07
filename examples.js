// 1. Fuzzy search in an array of strings
console.log('\n*** Fuzzy search in an array of strings ***');

const SearchEngine = require('./search-engine');
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

// 2. Fuzzy search in an array of objects with nested strings
console.log('\n*** Fuzzy search in an array of objects with nested strings ***');

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

// 3. Fuzzy comparing of strings
console.log('\n*** Fuzzy comparing of strings ***');

const StringsComparator = require('./strings-comparator');
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
