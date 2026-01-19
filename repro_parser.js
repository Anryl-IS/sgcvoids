const fs = require('fs');

function stripQuotes(str) {
    if (!str) return "";
    if (str.startsWith('"') && str.endsWith('"')) return str.substring(1, str.length - 1);
    return str;
}

const text = fs.readFileSync('debug_data.csv', 'utf8');
const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

let i = 0;
// Fast forward to line 157 where "Total :" is, then 158.
// Actually let's just test the specific string logic
const trickyAmount = '"1,290"';
const parsedWrong = parseInt(trickyAmount.replace(/,/g, '')) || 0;
console.log(`Original: ${trickyAmount}`);
console.log(`Parsed (Start): ${parseInt(trickyAmount.replace(/,/g, ''))}`);
console.log(`Parsed (Result with || 0): ${parsedWrong}`);

const trickyReceipts = '"15"'; // Unquoted in file usually, but let's test if quoted
const parsedFixed = parseInt(stripQuotes(trickyAmount).replace(/,/g, '')) || 0;
console.log(`Fixed Logic: ${parsedFixed}`);
