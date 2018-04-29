const request = require('request');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;


let parkrunBaseUrl = 'http://www.parkrun.com.au';

module.exports.getAthlete = (athleteId) => {
    return new Promise((resolve, reject) => {
        let url = `${parkrunBaseUrl}/results/athleteresultshistory/?athleteNumber=${athleteId}`;

        request(url, function (error, response, body) {
            if (error) return reject(error);
            if (response.statusCode !== 200) return reject(response);

            const dom = new JSDOM(body);

    
            // Matt DOWNS (73 parkruns)
            let heading = dom.window.document.querySelector('#content h2').textContent;
            let name = heading.split('(')[0].trim();
            let totalRuns = parseInt(heading.split('(')[1].match(/\d+/));
    

            let resultsTables = dom.window.document.querySelectorAll('#results');
    

            // Recent runs
            let recentRuns = [];
            let recentTable = resultsTables[0].querySelectorAll('tbody > tr');
            for (let row of recentTable) {
                let run = {
                    event: row.cells[0].textContent,
                    eventUrl: row.cells[0].querySelector('a:not(:empty)').href,
                    date: row.cells[1].textContent,
                    genderPosition: row.cells[2].textContent,
                    overallPosition: row.cells[3].textContent,
                    time: row.cells[4].textContent,
                    ageGrade: row.cells[5].textContent
                };
                recentRuns.push(run);
            }
    
    
            // Event summary
            let eventSummary = [];
            let eventTable = resultsTables[1].querySelectorAll('tbody > tr');
            for (let row of eventTable) {
                let event = {
                    event: row.cells[0].textContent,
                    eventUrl: row.cells[0].querySelector('a:not(:empty)').href,
                    runs: row.cells[1].textContent,
                    bestGenderPosition: row.cells[2].textContent,
                    bestOverallPosition: row.cells[3].textContent,
                    bestTime: row.cells[4].textContent
                };
                eventSummary.push(event);
            }
    
            let volunteerSummary = [];
    

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