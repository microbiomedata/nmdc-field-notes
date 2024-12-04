import { TemplateName } from "../../api";

type VisibilityLevel = "common" | "occasional";

interface SlotVisibilities
  extends Partial<Record<TemplateName, VisibilityLevel>> {
  _default?: VisibilityLevel;
}

/**
 * This object encodes which slots are commonly, occasionally, or uncommonly measured at sample
 * collection time. This was the output of a manual curation process. At some point we might
 * consider encoding this directly in the submission schema somehow. But for now, this is a simple
 * way to get the job done. The structure of the object is:
 * {
 *   <slot_name>: {
 *     _default?: "common" | "occasional",
 *     <template_name>?: "common" | "occasional",
 *     ...
 *   },
 *   ...
 * }
 * Each key in the top-level object is a slot name. The value is an object that can contain a
 * "_default" key and/or keys for specific template names (e.g. soil). The value of these keys is
 * either "common" or "occasional". The setting in the "_default" key is used if there is no specific
 * setting for a given template.
 */
const slotVisibilities: Record<string, SlotVisibilities> = {
  agrochem_addition: {
    _default: "occasional",
  },
  air_PM_concen: {
    _default: "occasional",
  },
  air_temp_regm: {
    _default: "occasional",
  },
  alt: {
    air: "common",
  },
  ances_data: {
    _default: "occasional",
  },
  antibiotic_regm: {
    _default: "occasional",
  },
  bac_resp: {
    _default: "occasional",
  },
  barometric_press: {
    _default: "occasional",
  },
  biol_stat: {
    _default: "occasional",
  },
  biotic_regm: {
    _default: "occasional",
  },
  blood_press_diast: {
    _default: "common",
  },
  blood_press_syst: {
    _default: "common",
  },
  bulk_elect_conductivity: {
    _default: "occasional",
  },
  carb_dioxide: {
    air: "occasional",
  },
  carb_monoxide: {
    _default: "occasional",
  },
  chem_administration: {
    _default: "occasional",
  },
  chem_mutagen: {
    _default: "occasional",
  },
  collection_date: {
    _default: "common",
  },
  collection_date_inc: {
    _default: "occasional",
  },
  collection_time: {
    _default: "common",
  },
  collection_time_inc: {
    _default: "occasional",
  },
  conduc: {
    _default: "occasional",
  },
  cult_root_med: {
    _default: "occasional",
  },
  cur_land_use: {
    _default: "common",
  },
  cur_vegetation: {
    _default: "common",
  },
  cur_vegetation_meth: {
    _default: "occasional",
  },
  density: {
    _default: "occasional",
  },
  depth: {
    _default: "occasional",
    soil: "common",
    "host-associated": "common",
    sediment: "common",
    water: "common",
  },
  down_par: {
    _default: "occasional",
  },
  drainage_class: {
    _default: "occasional",
  },
  elev: {
    _default: "occasional",
    soil: "common",
    air: "common",
    "microbial mat_biofilm": "common",
    "built environment": "common",
    "plant-associated": "common",
    water: "common",
  },
  experimental_factor_other: {
    _default: "occasional",
  },
  fertilizer_regm: {
    _default: "occasional",
  },
  filter_method: {
    _default: "occasional",
  },
  fungicide_regm: {
    _default: "occasional",
  },
  gaseous_environment: {
    _default: "occasional",
  },
  genetic_mod: {
    _default: "occasional",
  },
  geo_loc_name: {
    _default: "common",
  },
  gravidity: {
    _default: "occasional",
  },
  growth_facil: {
    _default: "common",
  },
  growth_habit: {
    _default: "occasional",
  },
  growth_hormone_regm: {
    _default: "occasional",
  },
  herbicide_regm: {
    _default: "occasional",
  },
  horizon_meth: {
    _default: "occasional",
  },
  host_age: {
    _default: "common",
  },
  host_body_habitat: {
    _default: "occasional",
  },
  host_body_product: {
    _default: "occasional",
  },
  host_body_site: {
    _default: "common",
  },
  host_body_temp: {
    _default: "common",
  },
  host_color: {
    _default: "occasional",
  },
  host_common_name: {
    _default: "common",
  },
  host_disease_stat: {
    _default: "occasional",
  },
  host_dry_mass: {
    _default: "occasional",
  },
  host_genotype: {
    _default: "occasional",
  },
  host_height: {
    _default: "occasional",
  },
  host_last_meal: {
    _default: "occasional",
  },
  host_length: {
    _default: "occasional",
  },
  host_life_stage: {
    _default: "occasional",
  },
  host_phenotype: {
    _default: "occasional",
  },
  host_sex: {
    _default: "occasional",
  },
  host_shape: {
    _default: "occasional",
  },
  host_subject_id: {
    _default: "common",
  },
  host_subspecf_genlin: {
    _default: "occasional",
  },
  host_substrate: {
    _default: "occasional",
  },
  host_symbiont: {
    _default: "occasional",
  },
  host_tot_mass: {
    _default: "occasional",
  },
  host_wet_mass: {
    _default: "occasional",
  },
  humidity: {
    _default: "common",
  },
  humidity_regm: {
    _default: "occasional",
  },
  infiltrations: {
    _default: "occasional",
  },
  isotope_exposure: {
    _default: "occasional",
  },
  lat_lon: {
    _default: "common",
  },
  light_intensity: {
    _default: "occasional",
  },
  light_regm: {
    _default: "occasional",
  },
  local_class: {
    _default: "occasional",
  },
  local_class_meth: {
    _default: "occasional",
  },
  mechanical_damage: {
    _default: "occasional",
  },
  methane: {
    _default: "occasional",
  },
  mineral_nutr_regm: {
    _default: "occasional",
  },
  misc_param: {
    _default: "occasional",
  },
  non_min_nutr_regm: {
    _default: "occasional",
  },
  other_treatment: {
    _default: "occasional",
  },
  oxy_stat_samp: {
    _default: "occasional",
  },
  oxygen: {
    _default: "occasional",
  },
  pesticide_regm: {
    _default: "occasional",
  },
  ph: {
    _default: "occasional",
  },
  ph_meth: {
    _default: "occasional",
  },
  ph_regm: {
    _default: "occasional",
  },
  plant_growth_med: {
    _default: "occasional",
  },
  plant_product: {
    _default: "occasional",
  },
  plant_sex: {
    _default: "occasional",
  },
  plant_struc: {
    _default: "common",
  },
  pollutants: {
    _default: "occasional",
  },
  pressure: {
    _default: "occasional",
  },
  profile_position: {
    _default: "occasional",
  },
  radiation_regm: {
    _default: "occasional",
  },
  rainfall_regm: {
    _default: "occasional",
  },
  redox_potential: {
    _default: "occasional",
  },
  root_cond: {
    _default: "occasional",
  },
  samp_capt_status: {
    _default: "occasional",
  },
  samp_collec_device: {
    _default: "occasional",
    soil: "common",
    sediment: "common",
    water: "common",
  },
  samp_collec_method: {
    _default: "occasional",
  },
  samp_dis_stage: {
    _default: "occasional",
  },
  samp_mat_process: {
    _default: "occasional",
  },
  samp_name: {
    _default: "common",
  },
  samp_size: {
    _default: "common",
  },
  samp_store_temp: {
    _default: "occasional",
    soil: "common",
    sediment: "common",
  },
  sediment_type: {
    _default: "occasional",
  },
  sieving: {
    _default: "occasional",
  },
  size_frac: {
    air: "occasional",
    "microbial mat_biofilm": "occasional",
    "plant-associated": "occasional",
    sediment: "occasional",
    water: "occasional",
  },
  size_frac_low: {
    _default: "occasional",
  },
  size_frac_up: {
    _default: "occasional",
  },
  slope_aspect: {
    _default: "occasional",
  },
  slope_gradient: {
    _default: "occasional",
  },
  soil_horizon: {
    _default: "occasional",
  },
  solar_irradiance: {
    _default: "occasional",
  },
  standing_water_regm: {
    _default: "occasional",
  },
  start_date_inc: {
    _default: "occasional",
  },
  start_time_inc: {
    _default: "occasional",
  },
  store_cond: {
    _default: "occasional",
  },
  temp: {
    _default: "occasional",
    air: "common",
  },
  tidal_stage: {
    _default: "occasional",
  },
  tillage: {
    _default: "occasional",
  },
  tot_depth_water_col: {
    _default: "occasional",
  },
  turbidity: {
    _default: "occasional",
  },
  ventilation_rate: {
    _default: "occasional",
  },
  ventilation_type: {
    _default: "occasional",
  },
  water_cont_soil_meth: {
    _default: "occasional",
  },
  water_content: {
    _default: "occasional",
  },
  water_current: {
    _default: "occasional",
  },
  water_temp_regm: {
    _default: "occasional",
  },
  watering_regm: {
    _default: "occasional",
  },
  wind_direction: {
    _default: "occasional",
  },
  wind_speed: {
    _default: "occasional",
  },
};

export default slotVisibilities;
