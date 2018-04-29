const Joi = require('Joi');
const parkrunCrawler = require('../index');


[{
    athleteId: '2054291',
    name: 'Matt DOWNS'
},{
    athleteId: '1830855',
    name: 'Frances GREVILLE-EYRES'
}].forEach(testAthlete)


function testAthlete(testData) {
    return describe(`athlete ${testData.name}`, () => {

        let athlete = {};

        beforeAll(async function () {
            athlete = await parkrunCrawler.getAthlete(testData.athleteId);
        });

        test(`name is ${testData.name}`, () => {
            Joi.assert(athlete.name, Joi.string().valid(testData.name).required());
        });

        test('totalRuns is an integer', () => {
            Joi.assert(athlete.totalRuns, Joi.number().integer().required());
        });

        test('recentRuns is an array containing the required data', () => {
            let recentRunsSchema = Joi.object().keys({
                event: Joi.string().required(),
                eventUrl: Joi.string().required(),
                date: Joi.string().required(),
                genderPosition: Joi.number().integer().required(),
                overallPosition: Joi.number().integer().required(),
                time: Joi.string().required(),
                ageGrade: Joi.string().required()
            });

            Joi.assert(athlete.recentRuns, Joi.array().items(recentRunsSchema).required());
        });

        test('eventSummary is an array containing the required data', () => {
            let eventSummarySchema = Joi.object().keys({
                event: Joi.string().required(),
                eventUrl: Joi.string().required(),
                count: Joi.number().integer().required(),
                bestGenderPosition: Joi.number().integer().required(),
                bestOverallPosition: Joi.number().integer().required(),
                bestTime: Joi.string().required()
            });

            Joi.assert(athlete.eventSummary, Joi.array().items(eventSummarySchema).required());
        });

        test('volunteerSummary is an array containing the required data', () => {
            let volunteerSummarySchema = Joi.object().keys({
                year: Joi.string().required(),
                role: Joi.string().required(),
                count: Joi.number().integer().required()
            });

            Joi.assert(athlete.volunteerSummary, Joi.array().items(volunteerSummarySchema).required());
        });

    });
}