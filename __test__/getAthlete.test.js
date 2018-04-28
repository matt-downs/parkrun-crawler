const Joi = require('Joi');
const parkrunCrawler = require('../index');


[{
    athleteId: '2054291',
    country: 'au'
}].forEach(testAthlete)



function testAthlete(testData) {
    return describe(`athlete from ${testData.country}`, () => {

        let athlete = {};

        beforeAll(async function () {
            athlete = await parkrunCrawler.getAthlete(testData.athleteId, testData.country);
        });

        test('name is a string', () => {
            Joi.assert(athlete.name, Joi.string().required());
        });

        test('totalRuns is an integer', () => {
            Joi.assert(athlete.totalRuns, Joi.number().integer().required());
        });

        test('recentRuns is an array containing the required data', () => {
            let recentRunsSchema = Joi.object().keys({
                event: Joi.string().required(),
                eventUrl: Joi.string().required(),
                date: Joi.string().required(),
                genderPosition: Joi.string().required(),
                overallPosition: Joi.string().required(),
                time: Joi.string().required(),
                ageGrade: Joi.string().required()
            });

            Joi.assert(athlete.recentRuns, Joi.array().items(recentRunsSchema).required());
        });

        test('eventSummary is an array containing the required data', () => {
            let eventSummarySchema = Joi.object().keys({
                event: Joi.string().required(),
                eventUrl: Joi.string().required(),
                runs: Joi.string().required(),
                bestGenderPosition: Joi.string().required(),
                bestOverallPosition: Joi.string().required(),
                bestTime: Joi.string().required()
            });

            Joi.assert(athlete.eventSummary, Joi.array().items(eventSummarySchema).required());
        });

        test('volunteerSummary is an array containing the required data', () => {
            // let volunteerSummarySchema = Joi.object().keys({
            //     event: Joi.string().required(),
            //     eventUrl: Joi.string().required(),
            //     date: Joi.string().required(),
            //     genderPosition: Joi.string().required(),
            //     overallPosition: Joi.string().required(),
            //     time: Joi.string().required(),
            //     ageGrade: Joi.string().required()
            // });

            // Joi.assert(athlete.volunteerSummary, Joi.array().items(volunteerSummarySchema).required());
        });

    });
}