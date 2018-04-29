const request = require('request');
const cheerio = require('cheerio')



let parkrunBaseUrl = 'http://www.parkrun.com.au';

module.exports.getAthlete = (athleteId) => {
    return new Promise((resolve, reject) => {
        let url = `${parkrunBaseUrl}/results/athleteresultshistory/?athleteNumber=${athleteId}`;

        request(url, function (error, response, body) {
            if (error) return reject(error);
            if (response.statusCode !== 200) return reject(response);

            const $ = cheerio.load(body)


            // Matt DOWNS (73 parkruns)
            let heading = $('#content h2').first().text();
            let name = heading.split('(')[0].trim();
            let totalRuns = parseInt(heading.split('(')[1].match(/\d+/));


            let resultsTables = $('#results');


            // Recent runs
            let recentRuns = [];
            let recentTable = $(resultsTables[0]).find('tbody > tr').each((i, row) => {
                let run = {
                    event: $(row.children[0]).text(),
                    eventUrl: $(row.children[0]).find('a:not(:empty)').attr('href'),
                    date: $(row.children[1]).text(),
                    genderPosition: parseInt($(row.children[2]).text()),
                    overallPosition: parseInt($(row.children[3]).text()),
                    time: $(row.children[4]).text(),
                    ageGrade: $(row.children[5]).text()
                };
                recentRuns.push(run);
            });


            // Event summary
            let eventSummary = [];
            let eventTable = $(resultsTables[1]).find('tbody > tr').each((i, row) => {
                let event = {
                    event: $(row.children[0]).text(),
                    eventUrl: $(row.children[0]).find('a:not(:empty)').attr('href'),
                    count: parseInt($(row.children[1]).text()),
                    bestGenderPosition: parseInt($(row.children[2]).text()),
                    bestOverallPosition: parseInt($(row.children[3]).text()),
                    bestTime: $(row.children[4]).text()
                };
                eventSummary.push(event);
            });


            // Volunteer summary
            let volunteerSummary = [];
            let volunteerTable = $(resultsTables[2]).find('tbody > tr').each((i, row) => {
                let event = {
                    year: $(row.children[0]).text(),
                    role: $(row.children[1]).text(),
                    count: parseInt($(row.children[2]).text())
                };
                volunteerSummary.push(event);
            });

            const athlete = {
                name: name,
                totalRuns: totalRuns,
                recentRuns: recentRuns,
                eventSummary: eventSummary,
                volunteerSummary: volunteerSummary
            };

            resolve(athlete);
        });
    });
}