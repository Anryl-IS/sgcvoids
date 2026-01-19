const https = require('https');

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQeTaEHJsuYfXHSBK1DePr0wjxElZZtEMnObZ5_iRdyYAt-1SvfPGbKVrsHRtUMOFI5_LyJiWnySn80/pub?gid=1817485847&single=true&output=csv";

https.get(url, (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        const lines = data.split(/\r?\n/);
        console.log("Headers:", lines[0]);
        console.log("First 3 rows:");
        console.log(lines.slice(1, 4).join('\n'));
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
