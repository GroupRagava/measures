// Adds misc utility functions to the root JS object. These are then
// available for use by the supporting map-reduce functions for any measure
// that needs common definitions of diabetes-specific algorithms.
//
// lib/qme/mongo_helpers.rb executes this function on a database
// connection.
(function () {
  var root = this;
  
  // Takes an arbitrary number of arrays and single values and returns a flattened
  // array of all of the elements with any null values removed.
  root.normalize = function() {
    return _.compact(_.flatten(arguments));
  }

  // Returns count of something that occured within 1 day of an encounter
  root.somethingDuringEncounter = function (something, encounter, startTimeRange, endTimeRange) {
    var result = 0;
    var i, j;
    var day = 24 * 60 * 60;

    something = root.normalize(something);
    encounter = root.normalize(encounter);

    // for each something, see if there is an encounter within 1 day
    for (i = 0; i < something.length; i++) {
      if (!something[i] || something[i] > endTimeRange || something[i] < startTimeRange) {
        continue;
      }
      window_start = something[i] - day;
      window_end = something[i] + day;
      for (j = 0; j < encounter.length; j++) {
        if (!encounter[i] || encounter[i] > endTimeRange || encounter[i] < startTimeRange) {
          continue;
        }
        if (encounter[j] >= window_start && encounter[j] <= window_end) {
          result++;
        }
      }
    }
    return result;
  };

  // Returns count of diagnoses that occured within 1 day of an encounter
  root.eventDuringEncounter = function (event, encounter, startTimeRange, endTimeRange) {
    return root.somethingDuringEncounter(event, encounter, startTimeRange, endTimeRange);
  };

  // Returns count of diagnoses that occured within 1 day of an encounter
  root.diagnosisDuringEncounter = function (diagnosis, encounter, startTimeRange, endTimeRange) {
    return root.somethingDuringEncounter(diagnosis, encounter, startTimeRange, endTimeRange);
  }

  // Returns count of number of somethings that are followed by at least one action
  root.actionAfterSomething = function (something, action) {
    something = root.normalize(something);
    action = root.normalize(action);

    var result = 0;
    for (var i = 0; i < something.length; i++) {
      var timeStamp = something[i];
      for (var j = 0; j < action.length; j++) {
        if (action[j] >= timeStamp) result++;
      }
    }
    return result;
  }

  // Returns count of number of readings that are followed by at least one action
  root.actionAfterReading = function (readings, action) {
<<<<<<< HEAD
    if (!_.isArray(readings)) readings = [readings];
    if (!_.isArray(action)) action = [action];
=======
    readings = root.normalize(readings);
    action = root.normalize(action);

>>>>>>> marc/master
    var results = 0; // number of readings that are followed by an action
    for (var i = 0; i < readings.length; i++) {
      if (!readings[i]) continue;
      var timeStamp = readings[i].date;
      var result = 0; // number of actions that follow a particular reading
      for (var j = 0; j < action.length; j++) {
        if (!action[j]) continue;
        if (action[j] >= timeStamp) result++;
      }
      if (result > 0) results++; // if there are any actions that follow this reading, increment results
    }
    return results;
  };

  // Returns the min readings[i].value where readings[i].date is in
  // the supplied startDate and endDate. If no reading meet this criteria,
  // returns defaultValue.
  root.minValueInDateRange = function (readings, startDate, endDate, defaultValue) {
    var readingInDateRange = function (reading) {
      var result = inRange(reading.date, startDate, endDate);
      return result;
    };

    if (!readings || readings.length < 1) return defaultValue;

    var allInDateRange = _.select(readings, readingInDateRange);
    var lowest = _.min(allInDateRange, function (reading) {
      return reading.value;
    });
    if (lowest) return lowest.value;
    else
    return defaultValue;
  };

  //  unique_dates:  list of unique dates in a list of times
  root.unique_dates = function (times) {
    if (!_.isArray(times)) { // a single date is unique
      return times;
    }
    var dates = _.map(times, function (time) {
      return parseInt((time / (24 * 60 * 60)).toFixed(0)) * (24 * 60 * 60);
    });
    return (_.uniq(dates));
  };

})();
