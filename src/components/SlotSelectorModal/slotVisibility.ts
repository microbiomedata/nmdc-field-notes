import { TemplateName } from "../../api";

type VisibilityLevel = "common" | "uncommon";

interface SlotVisibility
  extends Partial<Record<TemplateName, VisibilityLevel>> {
  _default?: VisibilityLevel;
}

/**
 * This object encodes which slots are commonly, uncommonly, or rarely measured in the field. This
 * was the output of a manual curation process. At some point we might consider encoding this
 * directly in the submission schema somehow. But for now, this is a simple way to get the job done.
 * The structure of the object is:
 * {
 *   <slot_name>: {
 *     _default?: "common" | "uncommon",
 *     <template_name>?: "common" | "uncommon",
 *     ...
 *   },
 *   ...
 * }
 * Each key in the top-level object is a slot name. The value is an object that can contain a
 * "_default" key and/or keys for specific template names (e.g. soil). The value of these keys is
 * either "common" or "uncommon". The setting in the "_default" key is used if there is no specific
 * setting for a given template.
 */
const slotVisibilities: Record<string, SlotVisibility> = {
  agrochem_addition: {
    _default: "uncommon",
  },
  air_PM_concen: {
    _default: "uncommon",
  },
  air_temp_regm: {
    _default: "uncommon",
  },
  alt: {
    air: "common",
  },
  ances_data: {
    _default: "uncommon",
  },
  antibiotic_regm: {
    _default: "uncommon",
  },
  bac_resp: {
    _default: "uncommon",
  },
  barometric_press: {
    _default: "uncommon",
  },
  biol_stat: {
    _default: "uncommon",
  },
  biotic_regm: {
    _default: "uncommon",
  },
  blood_press_diast: {
    _default: "common",
  },
  blood_press_syst: {
    _default: "common",
  },
  bulk_elect_conductivity: {
    _default: "uncommon",
  },
  carb_dioxide: {
    air: "uncommon",
  },
  carb_monoxide: {
    _default: "uncommon",
  },
  chem_administration: {
    _default: "uncommon",
  },
  chem_mutagen: {
    _default: "uncommon",
  },
  collection_date: {
    _default: "common",
  },
  collection_date_inc: {
    _default: "uncommon",
  },
  collection_time: {
    _default: "common",
  },
  collection_time_inc: {
    _default: "uncommon",
  },
  conduc: {
    _default: "uncommon",
  },
  cult_root_med: {
    _default: "uncommon",
  },
  cur_land_use: {
    _default: "common",
  },
  cur_vegetation: {
    _default: "common",
  },
  cur_vegetation_meth: {
    _default: "uncommon",
  },
  density: {
    _default: "uncommon",
  },
  depth: {
    _default: "uncommon",
    soil: "common",
    "host-associated": "common",
    sediment: "common",
    water: "common",
  },
  down_par: {
    _default: "uncommon",
  },
  drainage_class: {
    _default: "uncommon",
  },
  elev: {
    _default: "uncommon",
    soil: "common",
    air: "common",
    "microbial mat_biofilm": "common",
    "built environment": "common",
    "plant-associated": "common",
    water: "common",
  },
  experimental_factor_other: {
    _default: "uncommon",
  },
  fertilizer_regm: {
    _default: "uncommon",
  },
  filter_method: {
    _default: "uncommon",
  },
  fungicide_regm: {
    _default: "uncommon",
  },
  gaseous_environment: {
    _default: "uncommon",
  },
  genetic_mod: {
    _default: "uncommon",
  },
  geo_loc_name: {
    _default: "common",
  },
  gravidity: {
    _default: "uncommon",
  },
  growth_facil: {
    _default: "common",
  },
  growth_habit: {
    _default: "uncommon",
  },
  growth_hormone_regm: {
    _default: "uncommon",
  },
  herbicide_regm: {
    _default: "uncommon",
  },
  horizon_meth: {
    _default: "uncommon",
  },
  host_age: {
    _default: "common",
  },
  host_body_habitat: {
    _default: "uncommon",
  },
  host_body_product: {
    _default: "uncommon",
  },
  host_body_site: {
    _default: "common",
  },
  host_body_temp: {
    _default: "common",
  },
  host_color: {
    _default: "uncommon",
  },
  host_common_name: {
    _default: "common",
  },
  host_disease_stat: {
    _default: "uncommon",
  },
  host_dry_mass: {
    _default: "uncommon",
  },
  host_genotype: {
    _default: "uncommon",
  },
  host_height: {
    _default: "uncommon",
  },
  host_last_meal: {
    _default: "uncommon",
  },
  host_length: {
    _default: "uncommon",
  },
  host_life_stage: {
    _default: "uncommon",
  },
  host_phenotype: {
    _default: "uncommon",
  },
  host_sex: {
    _default: "uncommon",
  },
  host_shape: {
    _default: "uncommon",
  },
  host_subject_id: {
    _default: "common",
  },
  host_subspecf_genlin: {
    _default: "uncommon",
  },
  host_substrate: {
    _default: "uncommon",
  },
  host_symbiont: {
    _default: "uncommon",
  },
  host_tot_mass: {
    _default: "uncommon",
  },
  host_wet_mass: {
    _default: "uncommon",
  },
  humidity: {
    _default: "common",
  },
  humidity_regm: {
    _default: "uncommon",
  },
  infiltrations: {
    _default: "uncommon",
  },
  isotope_exposure: {
    _default: "uncommon",
  },
  lat_lon: {
    _default: "common",
  },
  light_intensity: {
    _default: "uncommon",
  },
  light_regm: {
    _default: "uncommon",
  },
  local_class: {
    _default: "uncommon",
  },
  local_class_meth: {
    _default: "uncommon",
  },
  mechanical_damage: {
    _default: "uncommon",
  },
  methane: {
    _default: "uncommon",
  },
  mineral_nutr_regm: {
    _default: "uncommon",
  },
  misc_param: {
    _default: "uncommon",
  },
  non_min_nutr_regm: {
    _default: "uncommon",
  },
  other_treatment: {
    _default: "uncommon",
  },
  oxy_stat_samp: {
    _default: "uncommon",
  },
  oxygen: {
    _default: "uncommon",
  },
  pesticide_regm: {
    _default: "uncommon",
  },
  ph: {
    _default: "uncommon",
  },
  ph_meth: {
    _default: "uncommon",
  },
  ph_regm: {
    _default: "uncommon",
  },
  plant_growth_med: {
    _default: "uncommon",
  },
  plant_product: {
    _default: "uncommon",
  },
  plant_sex: {
    _default: "uncommon",
  },
  plant_struc: {
    _default: "common",
  },
  pollutants: {
    _default: "uncommon",
  },
  pressure: {
    _default: "uncommon",
  },
  profile_position: {
    _default: "uncommon",
  },
  radiation_regm: {
    _default: "uncommon",
  },
  rainfall_regm: {
    _default: "uncommon",
  },
  redox_potential: {
    _default: "uncommon",
  },
  root_cond: {
    _default: "uncommon",
  },
  samp_capt_status: {
    _default: "uncommon",
  },
  samp_collec_device: {
    _default: "uncommon",
    soil: "common",
    sediment: "common",
    water: "common",
  },
  samp_collec_method: {
    _default: "uncommon",
  },
  samp_dis_stage: {
    _default: "uncommon",
  },
  samp_mat_process: {
    _default: "uncommon",
  },
  samp_name: {
    _default: "common",
  },
  samp_size: {
    _default: "common",
  },
  samp_store_temp: {
    _default: "uncommon",
    soil: "common",
    sediment: "common",
  },
  sediment_type: {
    _default: "uncommon",
  },
  sieving: {
    _default: "uncommon",
  },
  size_frac: {
    air: "uncommon",
    "microbial mat_biofilm": "uncommon",
    "plant-associated": "uncommon",
    sediment: "uncommon",
    water: "uncommon",
  },
  size_frac_low: {
    _default: "uncommon",
  },
  size_frac_up: {
    _default: "uncommon",
  },
  slope_aspect: {
    _default: "uncommon",
  },
  slope_gradient: {
    _default: "uncommon",
  },
  soil_horizon: {
    _default: "uncommon",
  },
  solar_irradiance: {
    _default: "uncommon",
  },
  standing_water_regm: {
    _default: "uncommon",
  },
  start_date_inc: {
    _default: "uncommon",
  },
  start_time_inc: {
    _default: "uncommon",
  },
  store_cond: {
    _default: "uncommon",
  },
  temp: {
    _default: "uncommon",
    air: "common",
  },
  tidal_stage: {
    _default: "uncommon",
  },
  tillage: {
    _default: "uncommon",
  },
  tot_depth_water_col: {
    _default: "uncommon",
  },
  turbidity: {
    _default: "uncommon",
  },
  ventilation_rate: {
    _default: "uncommon",
  },
  ventilation_type: {
    _default: "uncommon",
  },
  water_cont_soil_meth: {
    _default: "uncommon",
  },
  water_content: {
    _default: "uncommon",
  },
  water_current: {
    _default: "uncommon",
  },
  water_temp_regm: {
    _default: "uncommon",
  },
  watering_regm: {
    _default: "uncommon",
  },
  wind_direction: {
    _default: "uncommon",
  },
  wind_speed: {
    _default: "uncommon",
  },
};

export default slotVisibilities;
