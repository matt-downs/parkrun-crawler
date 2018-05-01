# parkrun-crawler
Unfortunatley Parkrun does not provide an API to query athlete or run information - this module provides an easy way to pull athlete data straight from the Parkrun website.

Currently only the [athlete result history](http://www.parkrun.com.au/results/athleteresultshistory/?athleteNumber=2054291
) page can be crawled using the `getAthlete(athleteId)` method.

`getAthlete` returns a promise that will resolve with the crawled athlete data. 

## Usage
```js
import { getAthlete } from 'parkrun-crawler';

async function myFunc() {
    try {
        athlete = await getAthlete('2054291');
        console.log(athlete);
    } catch (e) {
        console.log(e);
    }
}
myFunc();
```
### Will output the following: 
```js
{
    name: 'Matt DOWNS',
    totalRuns: 73,
    recentRuns: [{
        event: 'Ashgrove parkrun',
        eventUrl: 'http://www.parkrun.com.au/ashgrove/results',
        date: '14/04/2018',
        genderPosition: 38,
        overallPosition: 41,
        time: '23:33',
        ageGrade: '54.78%'
    }],
    eventSummary: [{
        event: 'Ashgrove parkrun',
        eventUrl: 'http://www.parkrun.com.au/ashgrove/results',
        count: 49,
        bestGenderPosition: 2,
        bestOverallPosition: 2,
        bestTime: '00:20:20'
    }],
    volunteerSummary: [{
        year: '2017',
        role: 'Photographer',
        count: 1
    }]
}
```
(recentRuns, eventSummary and volunteerSummary shortened for display purposes)