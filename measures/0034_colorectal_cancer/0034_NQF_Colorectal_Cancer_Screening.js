function () {
  var patient = this;
  var measure = patient.measures["0034"];
  if (measure==null)
    measure={};

  <%= init_js_frameworks %>

  var year = 365*24*60*60;
  var effective_date = <%= effective_date %>;
  var latest_birthdate = effective_date - 50*year;
  var earliest_birthdate = effective_date - 74*year;
  var earliest_encounter = effective_date - 2*year;
  var one_year = effective_date - 1*year;
  var five_years = effective_date - 5*year;
  var ten_years = effective_date - 10*year;
  
  var population = function() {
    return inRange(patient.birthdate, earliest_birthdate, latest_birthdate);
  }
  
  var denominator = function() {
    total_colectomy = measure.total_colectomy_procedure_performed!=null && lessThan(measure.total_colectomy_procedure_performed, effective_date);
    encounter = inRange(measure.encounter_outpatient_encounter, earliest_encounter, effective_date);
    return encounter && !total_colectomy;
  }
  
  var numerator = function() {
    colonoscopy = inRange(measure.colonoscopy_procedure_performed, ten_years, effective_date);
    sigmoidoscopy = inRange(measure.flexible_sigmoidoscopy_procedure_performed, five_years, effective_date);
    fobt = inRange(measure.fobt_laboratory_test_performed, one_year, effective_date);
    return colonoscopy || sigmoidoscopy || fobt;
  }
  
  var exclusion = function() {
    return inRange(measure.colorectal_cancer_diagnosis_active, one_year, effective_date);
  }
  
  map(patient, population, denominator, numerator, exclusion);
};