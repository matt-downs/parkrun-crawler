const request = require('request');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;


function getUrl(country) {
    switch (country.toLowerCase()) {
        case 'au':
            return 'www.parkrun.com.au';
        case 'ca':
            return 'www.parkrun.ca';
        case 'dk':
            return 'www.parkrun.dk';
        case 'fi':
            return 'www.parkrun.fi';
        case 'fr':
            return 'www.parkrun.fr';
        case 'de':
            return 'www.parkrun.com.de';
        case 'ie':
            return 'www.parkrun.ie';
        case 'it':
            return 'www.parkrun.it';
        case 'nz':
            return 'www.parkrun.co.nz';
        case 'no':
            return 'www.parkrun.no';
        case 'pl':
            return 'www.parkrun.pl';
        case 'ru':
            return 'www.parkrun.ru';
        case 'sg':
            return 'www.parkrun.sg';
        case 'za':
            return 'www.parkrun.co.za';
        case 'se':
            return 'www.parkrun.se';
        case 'uk':
            return 'www.parkrun.org.uk';
        case 'us':
            return 'www.parkrun.us';
    }
}


module.exports.getAthlete = (athleteId, countryCode) => {
    return new Promise((resolve, reject) => {
        let url = `http://${getUrl(countryCode)}/results/athleteresultshistory/?athleteNumber=${athleteId}`;

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