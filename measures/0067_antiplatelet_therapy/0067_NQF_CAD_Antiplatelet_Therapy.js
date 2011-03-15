function () {
  var patient = this;
  var measure = patient.measures["0067"];
  if (measure==null)
    measure={};

  <%= init_js_frameworks %>

  var day = 24*60*60;
  var year = 365*day;
  var effective_date = <%= effective_date %>;
  var latest_birthdate = effective_date - 18*year;
  var earliest_encounter = effective_date - 1*year;
  var first_diagnosis = null;
  var all_encounters = _.flatten(_.compact([
    measure.encounter_inpatient_discharge_encounter,
    measure.encounter_nursing_facility_encounter,
    measure.encounter_outpatient_encounter]));
  
  var population = function() {
    var cad_before_encounter = actionAfterSomething(
      measure.coronary_artery_disease_includes_mi_diagnosis_active, all_encounters);
    var surgery_before_encounter = actionAfterSomething(
      measure.cardiac_surgery_procedure_performed, all_encounters);
    var inpatient = inRange(measure.encounter_inpatient_discharge_encounter, 
      earliest_encounter, effective_date); 
    var outpatient = inRange(measure.encounter_outpatient_encounter, 
      earliest_encounter, effective_date); 
    var nursing = inRange(measure.encounter_nursing_facility_encounter, 
      earliest_encounter, effective_date); 
      
    return (patient.birthdate <= latest_birthdate) &&
      (cad_before_encounter || surgery_before_encounter) &&
      (nursing>=2 || outpatient>=2 || inpatient>=1);
  }
  
  var denominator = function() {
    return true;
  }
  
  var numerator = function() {
    var active = inRange(measure.antiplatelet_therapy_medication_active, 
      earliest_encounter, effective_date);
    var order = inRange(measure.antiplatelet_therapy_medication_order, 
      earliest_encounter, effective_date);
    return (active || order);
  }
  
  var exclusion = function() {
    var allergy = actionAfterSomething(
      measure.antiplatelet_therapy_medication_allergy, all_encounters);
    var adverse = actionAfterSomething(
      measure.antiplatelet_therapy_medication_adverse_event, all_encounters);
    var intollerence = actionAfterSomething(
      measure.antiplatelet_therapy_medication_intolerance, all_encounters);
    var disorder = actionAfterSomething(
      measure.bleeding_coagulation_disorders_diagnosis_active, all_encounters);
    var patient = inRange(measure.patient_reason_medication_not_done, 
      earliest_encounter, effective_date);
    var medical = inRange(measure.medical_reason_medication_not_done, 
      earliest_encounter, effective_date);
    var system = inRange(measure.system_reason_medication_not_done, 
      earliest_encounter, effective_date);
    return (allergy || adverse || intollerence || disorder || patient || medical || system);
  }
  
  map(patient, population, denominator, numerator, exclusion);
};