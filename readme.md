## parkrun-crawler
Unfortunatley Parkrun does not have an API that can be used to query athlete or run information - this module provides an easy way to pull athlete data straight from the Parkrun website.


Provided with an athlete ID, this package will crawl an athlete's summary page and return the following information:
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