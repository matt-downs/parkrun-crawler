"use strict";

var request = require("request");
var cheerio = require("cheerio");

var parkrunBaseUrl = "http://www.parkrun.com.au";

module.exports.getAthlete = function(athleteId) {
  return new Promise(function(resolve, reject) {
    var url =
      parkrunBaseUrl +
      "/results/athleteresultshistory/?athleteNumber=" +
      athleteId;

    request(url, function(error, response, body) {
      if (error) return reject(error);
      if (response.statusCode !== 200) return reject(response);

      var $ = cheerio.load(body);

      // Matt DOWNS (73 parkruns)
      var heading = $("#content h2")
        .first()
        .text();
      heading = heading.split("(");
      var name = heading[0].trim();
      var totalRuns = parseInt(heading[1].match(/\d+/));


      // Recent runs
      var recentRuns = [];

      $("#most-recent").next()
        .find("tbody > tr")
        .each(function(i, row) {
          var run = {
            event: $(row.children[0]).text(),
            eventUrl: $(row.children[0])
              .find("a:not(:empty)")
              .attr("href"),
            date: $(row.children[1]).text(),
            genderPosition: parseInt($(row.children[2]).text()),
            overallPosition: parseInt($(row.children[3]).text()),
            time: $(row.children[4]).text(),
            ageGrade: $(row.children[5]).text()
          };
          recentRuns.push(run);
        });

      // Event summary
      var eventSummary = [];
      
      $("#event-summary").next()
        .find("tbody > tr")
        .each(function(i, row) {
          var event = {
            event: $(row.children[0]).text(),
            eventUrl: $(row.children[0])
              .find("a:not(:empty)")
              .attr("href"),
            count: parseInt($(row.children[1]).text()),
            bestGenderPosition: parseInt($(row.children[2]).text()),
            bestOverallPosition: parseInt($(row.children[3]).text()),
            bestTime: $(row.children[4]).text()
          };
          eventSummary.push(event);
        });

      // Volunteer summary
      var volunteerSummary = [];

      $("#volunteer-summary").next()
        .find("tbody > tr")
        .each(function(i, row) {
          var event = {
            year: $(row.children[0]).text(),
            role: $(row.children[1]).text(),
            count: parseInt($(row.children[2]).text())
          };
          volunteerSummary.push(event);
        });

      var athlete = {
        id: athleteId,
        name: name,
        totalRuns: totalRuns,
        recentRuns: recentRuns,
        eventSummary: eventSummary,
        volunteerSummary: volunteerSummary
      };

      resolve(athlete);
    });
  });
};
