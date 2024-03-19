export type ExtensionExtensionTag = string;
export type AnnotationExtensionTag = string;
export type ElementName = string;
export type SchemaDefinitionName = string;
export type TypeDefinitionName = string;
export type SubsetDefinitionName = string;
export type DefinitionName = string;
export type EnumDefinitionName = string;
export type SlotDefinitionName = string;
export type ClassDefinitionName = string;
export type SettingSettingKey = string;
export type PrefixPrefixPrefix = string;
export type LocalNameLocalNameSource = string;
export type AltDescriptionAltDescriptionSource = string;
export type PermissibleValueText = string;
export type UniqueKeyUniqueKeyName = string;
/**
 * The formula used to generate the set of permissible values from the code_set values
 */
export enum PvFormulaOptions {
  /** The permissible values are the set of possible codes in the code set */
  CODE = "CODE",
  /** The permissible values are the set of CURIES in the code set */
  CURIE = "CURIE",
  /** The permissible values are the set of code URIs in the code set */
  URI = "URI",
  /** The permissible values are the set of FHIR coding elements derived from the code set */
  FHIR_CODING = "FHIR_CODING",
  /** The permissible values are the set of human readable labels in the code set */
  LABEL = "LABEL",
}
/**
 * enumeration of conditions by which a slot value should be set
 */
export enum PresenceEnum {
  UNCOMMITTED = "UNCOMMITTED",
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}
/**
 * enumeration of roles a slot on a relationship class can play
 */
export enum RelationalRoleEnum {
  /** a slot with this role connects a relationship to its subject/source node */
  SUBJECT = "SUBJECT",
  /** a slot with this role connects a relationship to its object/target node */
  OBJECT = "OBJECT",
  /** a slot with this role connects a relationship to its predicate/property */
  PREDICATE = "PREDICATE",
  /** a slot with this role connects a symmetric relationship to a node that represents either subject or object node */
  NODE = "NODE",
  /** a slot with this role connects a relationship to a node that is not subject/object/predicate */
  OTHER_ROLE = "OTHER_ROLE",
}
/**
 * permissible values for the relationship between an element and an alias
 */
export enum AliasPredicateEnum {
  EXACT_SYNONYM = "EXACT_SYNONYM",
  RELATED_SYNONYM = "RELATED_SYNONYM",
  BROAD_SYNONYM = "BROAD_SYNONYM",
  NARROW_SYNONYM = "NARROW_SYNONYM",
}

export interface AnyValue {}

/**
 * a tag/value pair used to add non-model information to an entry
 */
export interface Extension {
  /** a tag associated with an extension */
  tag: string;
  /** the actual annotation */
  value: AnyValue;
  /** a tag/text tuple attached to an arbitrary element */
  extensions?: { [index: ExtensionExtensionTag]: Extension };
}

/**
 * mixin for classes that support extension
 */
export interface Extensible {
  /** a tag/text tuple attached to an arbitrary element */
  extensions?: { [index: ExtensionExtensionTag]: Extension };
}

/**
 * mixin for classes that support annotations
 */
export interface Annotatable {
  /** a collection of tag/text tuples with the semantics of OWL Annotation */
  annotations?: { [index: AnnotationExtensionTag]: Annotation };
}

/**
 * a tag/value pair with the semantics of OWL Annotation
 */
export interface Annotation extends Extension, Annotatable {
  /** a collection of tag/text tuples with the semantics of OWL Annotation */
  annotations?: { [index: AnnotationExtensionTag]: Annotation };
}

/**
 * A unit of measure, or unit, is a particular quantity value that has been chosen as a scale for  measuring other quantities the same kind (more generally of equivalent dimension).
 */
export interface UnitOfMeasure {
  /** name of the unit encoded as a symbol */
  symbol?: string;
  /** An abbreviation for a unit is a short ASCII string that is used in place of the full name for the unit in  contexts where non-ASCII characters would be problematic, or where using the abbreviation will enhance  readability. When a power of a base unit needs to be expressed, such as squares this can be done using  abbreviations rather than symbols (source: qudt) */
  abbreviation?: string;
  /** the spelled out name of the unit, for example, meter */
  descriptive_name?: string;
  /** Used to link a unit to equivalent concepts in ontologies such as UO, SNOMED, OEM, OBOE, NCIT */
  exact_mappings?: string[];
  /** associates a QUDT unit with its UCUM code (case-sensitive). */
  ucum_code?: string;
  /** Expression for deriving this unit from other units */
  derivation?: string;
  /** Concept in a vocabulary or ontology that denotes the kind of quantity being measured, e.g. length */
  has_quantity_kind?: string;
  iec61360code?: string;
}

export interface Anything {}

/**
 * Generic metadata shared across definitions
 */
export interface CommonMetadata {
  /** a textual description of the element's purpose and use */
  description?: string;
  /** A sourced alternative description for an element */
  alt_descriptions?: {
    [index: AltDescriptionAltDescriptionSource]: AltDescription;
  };
  /** A concise human-readable display label for the element. The title should mirror the name, and should use ordinary textual punctuation. */
  title?: string;
  /** Description of why and when this element will no longer be used */
  deprecated?: string;
  /** Outstanding issues that needs resolution */
  todos?: string[];
  /** editorial notes about an element intended primarily for internal consumption */
  notes?: string[];
  /** notes and comments about an element intended primarily for external consumption */
  comments?: string[];
  /** example usages of an element */
  examples?: Example[];
  /** used to indicate membership of a term in a defined subset of terms used for a particular domain or application. */
  in_subset?: SubsetDefinitionName[];
  /** id of the schema that defined the element */
  from_schema?: string;
  /** the imports entry that this element was derived from.  Empty means primary source */
  imported_from?: string;
  /** A related resource from which the element is derived. */
  source?: string;
  /** the primary language used in the sources */
  in_language?: string;
  /** A list of related entities or URLs that may be of relevance */
  see_also?: string[];
  /** When an element is deprecated, it can be automatically replaced by this uri or curie */
  deprecated_element_has_exact_replacement?: string;
  /** When an element is deprecated, it can be potentially replaced by this uri or curie */
  deprecated_element_has_possible_replacement?: string;
  /** Alternate names/labels for the element. These do not alter the semantics of the schema, but may be useful to support search and alignment. */
  aliases?: string[];
  /** A list of structured_alias objects, used to provide aliases in conjunction with additional metadata. */
  structured_aliases?: StructuredAlias[];
  /** A list of terms from different schemas or terminology systems that have comparable meaning. These may include terms that are precisely equivalent, broader or narrower in meaning, or otherwise semantically related but not equivalent from a strict ontological perspective. */
  mappings?: string[];
  /** A list of terms from different schemas or terminology systems that have identical meaning. */
  exact_mappings?: string[];
  /** A list of terms from different schemas or terminology systems that have close meaning. */
  close_mappings?: string[];
  /** A list of terms from different schemas or terminology systems that have related meaning. */
  related_mappings?: string[];
  /** A list of terms from different schemas or terminology systems that have narrower meaning. */
  narrow_mappings?: string[];
  /** A list of terms from different schemas or terminology systems that have broader meaning. */
  broad_mappings?: string[];
  /** agent that created the element */
  created_by?: string;
  /** agent that contributed to the element */
  contributors?: string[];
  /** time at which the element was created */
  created_on?: string;
  /** time at which the element was last updated */
  last_updated_on?: string;
  /** agent that modified the element */
  modified_by?: string;
  /** status of the element */
  status?: string;
  /** the relative order in which the element occurs, lower values are given precedence */
  rank?: number;
  /** Controlled terms used to categorize an element. */
  categories?: string[];
  /** Keywords or tags used to describe the element */
  keywords?: string[];
}

/**
 * A named element in the model
 */
export interface Element extends Extensible, Annotatable, CommonMetadata {
  /** the unique name of the element within the context of the schema.  Name is combined with the default prefix to form the globally unique subject of the target class. */
  name: string;
  /** An allowed list of prefixes for which identifiers must conform. The identifier of this class or slot must begin with the URIs referenced by this prefix */
  id_prefixes?: string[];
  /** If true, then the id_prefixes slot is treated as being closed, and any use of an id that does not have this prefix is considered a violation. */
  id_prefixes_are_closed?: boolean;
  /** The native URI of the element. This is always within the namespace of the containing schema. Contrast with the assigned URI, via class_uri or slot_uri */
  definition_uri?: string;
  local_names?: { [index: LocalNameLocalNameSource]: LocalName };
  /** An established standard to which the element conforms. */
  conforms_to?: string;
  /** An element in another schema which this element conforms to. The referenced element is not imported into the schema for the implementing element. However, the referenced schema may be used to check conformance of the implementing element. */
  implements?: string[];
  /** An element in another schema which this element instantiates. */
  instantiates?: string[];
}

/**
 * A collection of definitions that make up a schema or a data model.
 */
export interface SchemaDefinition extends Element {
  /** The official schema URI */
  id: string;
  /** particular version of schema */
  version?: string;
  /** A list of schemas that are to be included in this schema */
  imports?: string[];
  /** license for the schema */
  license?: string;
  /** A collection of prefix expansions that specify how CURIEs can be expanded to URIs */
  prefixes?: { [index: PrefixPrefixPrefix]: Prefix };
  /** a list of Curie prefixes that are used in the representation of instances of the model.  All prefixes in this list are added to the prefix sections of the target models. */
  emit_prefixes?: string[];
  /** ordered list of prefixcommon biocontexts to be fetched to resolve id prefixes and inline prefix variables */
  default_curi_maps?: string[];
  /** The prefix that is used for all elements within a schema */
  default_prefix?: string;
  /** default slot range to be used if range element is omitted from a slot definition */
  default_range?: TypeDefinitionName;
  /** An index to the collection of all subset definitions in the schema */
  subsets?: { [index: SubsetDefinitionName]: SubsetDefinition };
  /** An index to the collection of all type definitions in the schema */
  types?: { [index: TypeDefinitionName]: TypeDefinition };
  /** An index to the collection of all enum definitions in the schema */
  enums?: { [index: EnumDefinitionName]: EnumDefinition };
  /** An index to the collection of all slot definitions in the schema */
  slots?: { [index: SlotDefinitionName]: SlotDefinition };
  /** An index to the collection of all class definitions in the schema */
  classes?: { [index: ClassDefinitionName]: ClassDefinition };
  /** Version of the metamodel used to load the schema */
  metamodel_version?: string;
  /** name, uri or description of the source of the schema */
  source_file?: string;
  /** modification date of the source of the schema */
  source_file_date?: string;
  /** size in bytes of the source of the schema */
  source_file_size?: number;
  /** date and time that the schema was loaded/generated */
  generation_date?: string;
  /** if true then induced/mangled slot names are not created for class_usage and attributes */
  slot_names_unique?: boolean;
  /** A collection of global variable settings */
  settings?: { [index: SettingSettingKey]: Setting };
}

/**
 * An abstract class grouping named types and anonymous type expressions
 */
export interface TypeExpression extends Expression {
  /** the string value of the slot must conform to this regular expression expressed in the string */
  pattern?: string;
  /** the string value of the slot must conform to the regular expression in the pattern expression */
  structured_pattern?: PatternExpression;
  /** an encoding of a unit */
  unit?: UnitOfMeasure;
  /** Causes the slot value to be interpreted as a uriorcurie after prefixing with this string */
  implicit_prefix?: string;
  /** the slot must have range string and the value of the slot must equal the specified value */
  equals_string?: string;
  /** the slot must have range string and the value of the slot must equal one of the specified values */
  equals_string_in?: string[];
  /** the slot must have range of a number and the value of the slot must equal the specified value */
  equals_number?: number;
  /** For ordinal ranges, the value must be equal to or higher than this */
  minimum_value?: Anything;
  /** For ordinal ranges, the value must be equal to or lower than this */
  maximum_value?: Anything;
  /** holds if none of the expressions hold */
  none_of?: AnonymousTypeExpression[];
  /** holds if only one of the expressions hold */
  exactly_one_of?: AnonymousTypeExpression[];
  /** holds if at least one of the expressions hold */
  any_of?: AnonymousTypeExpression[];
  /** holds if all of the expressions hold */
  all_of?: AnonymousTypeExpression[];
}

/**
 * A type expression that is not a top-level named type definition. Used for nesting.
 */
export interface AnonymousTypeExpression extends TypeExpression {}

/**
 * an element that whose instances are atomic scalar values that can be mapped to primitive types
 */
export interface TypeDefinition extends Element, TypeExpression {
  /** A parent type from which type properties are inherited */
  typeof?: TypeDefinitionName;
  /** python base type in the LinkML runtime that implements this type definition */
  base?: string;
  /** The uri that defines the possible values for the type definition */
  uri?: string;
  /** the name of the python object that implements this type definition */
  repr?: string;
  /** indicates that the domain element consists exactly of the members of the element in the range. */
  union_of?: TypeDefinitionName[];
}

/**
 * an element that can be used to group other metamodel elements
 */
export interface SubsetDefinition extends Element {}

/**
 * abstract base class for core metaclasses
 */
export interface Definition extends Element {
  /** A primary parent class or slot from which inheritable metaslots are propagated from. While multiple inheritance is not allowed, mixins can be provided effectively providing the same thing. The semantics are the same when translated to formalisms that allow MI (e.g. RDFS/OWL). When translating to a SI framework (e.g. java classes, python classes) then is a is used. When translating a framework without polymorphism (e.g. json-schema, solr document schema) then is a and mixins are recursively unfolded */
  is_a?: DefinitionName;
  /** Indicates the class or slot cannot be directly instantiated and is intended for grouping purposes. */
  abstract?: boolean;
  /** Indicates the class or slot is intended to be inherited from without being an is_a parent. mixins should not be inherited from using is_a, except by other mixins. */
  mixin?: boolean;
  /** A collection of secondary parent classes or slots from which inheritable metaslots are propagated from. */
  mixins?: DefinitionName[];
  /** Used to extend class or slot definitions. For example, if we have a core schema where a gene has two slots for identifier and symbol, and we have a specialized schema for my_organism where we wish to add a slot systematic_name, we can avoid subclassing by defining a class gene_my_organism, adding the slot to this class, and then adding an apply_to pointing to the gene class. The new slot will be 'injected into' the gene class. */
  apply_to?: DefinitionName[];
  /** The identifier of a "value set" -- a set of identifiers that form the possible values for the range of a slot. Note: this is different than 'subproperty_of' in that 'subproperty_of' is intended to be a single ontology term while 'values_from' is the identifier of an entire value set.  Additionally, this is different than an enumeration in that in an enumeration, the values of the enumeration are listed directly in the model itself. Setting this property on a slot does not guarantee an expansion of the ontological hierarchy into an enumerated list of possible values in every serialization of the model. */
  values_from?: string[];
  /** Used on a slot that stores the string serialization of the containing object. The syntax follows python formatted strings, with slot names enclosed in {}s. These are expanded using the values of those slots.
We call the slot with the serialization the s-slot, the slots used in the {}s are v-slots. If both s-slots and v-slots are populated on an object then the value of the s-slot should correspond to the expansion.
Implementations of frameworks may choose to use this property to either (a) PARSE: implement automated normalizations by parsing denormalized strings into complex objects (b) GENERARE: implement automated to_string labeling of complex objects
For example, a Measurement class may have 3 fields: unit, value, and string_value. The string_value slot may have a string_serialization of {value}{unit} such that if unit=cm and value=2, the value of string_value shouldd be 2cm */
  string_serialization?: string;
}

/**
 * An expression that constrains the range of a slot
 */
export interface EnumExpression extends Expression {
  /** the identifier of an enumeration code set. */
  code_set?: string;
  /** the version tag of the enumeration code set */
  code_set_tag?: string;
  /** the version identifier of the enumeration code set */
  code_set_version?: string;
  /** Defines the specific formula to be used to generate the permissible values. */
  pv_formula?: string;
  /** A list of possible values for a slot range */
  permissible_values?: { [index: PermissibleValueText]: PermissibleValue };
  /** An enum expression that yields a list of permissible values that are to be included, after subtracting the minus set */
  include?: AnonymousEnumExpression[];
  /** An enum expression that yields a list of permissible values that are to be subtracted from the enum */
  minus?: AnonymousEnumExpression[];
  /** An enum definition that is used as the basis to create a new enum */
  inherits?: EnumDefinitionName[];
  /** Specifies a query for obtaining a list of permissible values based on graph reachability */
  reachable_from?: ReachabilityQuery;
  /** Specifies a match query that is used to calculate the list of permissible values */
  matches?: MatchQuery;
  /** A list of identifiers that are used to construct a set of permissible values */
  concepts?: string[];
}

/**
 * An enum_expression that is not named
 */
export interface AnonymousEnumExpression extends EnumExpression {}

/**
 * an element whose instances must be drawn from a specified set of permissible values
 */
export interface EnumDefinition extends Definition, EnumExpression {
  /** URI of the enum that provides a semantic interpretation of the element in a linked data context. The URI may come from any namespace and may be shared between schemas */
  enum_uri?: string;
}

/**
 * A query that is used on an enum expression to dynamically obtain a set of permissivle values via a query that  matches on properties of the external concepts.
 */
export interface MatchQuery {
  /** A regular expression that is used to obtain a set of identifiers from a source_ontology to construct a set of permissible values */
  identifier_pattern?: string;
  /** An ontology or vocabulary or terminology that is used in a query to obtain a set of permissible values */
  source_ontology?: string;
}

/**
 * A query that is used on an enum expression to dynamically obtain a set of permissible values via walking from a  set of source nodes to a set of descendants or ancestors over a set of relationship types.
 */
export interface ReachabilityQuery {
  /** An ontology or vocabulary or terminology that is used in a query to obtain a set of permissible values */
  source_ontology?: string;
  /** A list of nodes that are used in the reachability query */
  source_nodes?: string[];
  /** A list of relationship types (properties) that are used in a reachability query */
  relationship_types?: string[];
  /** True if the reachability query should only include directly related nodes, if False then include also transitively connected */
  is_direct?: boolean;
  /** True if the query is reflexive */
  include_self?: boolean;
  /** True if the direction of the reachability query is reversed and ancestors are retrieved */
  traverse_up?: boolean;
}

/**
 * object that contains meta data about a synonym or alias including where it came from (source) and its scope (narrow, broad, etc.)
 */
export interface StructuredAlias
  extends Expression,
    Extensible,
    Annotatable,
    CommonMetadata {
  /** The literal lexical form of a structured alias; i.e the actual alias value. */
  literal_form: string;
  /** The relationship between an element and its alias. */
  predicate?: string;
  /** The category or categories of an alias. This can be drawn from any relevant vocabulary */
  categories?: string[];
}

/**
 * general mixin for any class that can represent some form of expression
 */
export interface Expression {}

/**
 * An abstract parent class for any nested expression
 */
export interface AnonymousExpression
  extends Expression,
    Extensible,
    Annotatable,
    CommonMetadata {}

/**
 * An expression that describes an abstract path from an object to another through a sequence of slot lookups
 */
export interface PathExpression
  extends Expression,
    Extensible,
    Annotatable,
    CommonMetadata {
  /** in a sequential list, this indicates the next member */
  followed_by?: PathExpression;
  /** holds if none of the expressions hold */
  none_of?: PathExpression[];
  /** holds if at least one of the expressions hold */
  any_of?: PathExpression[];
  /** holds if all of the expressions hold */
  all_of?: PathExpression[];
  /** holds if only one of the expressions hold */
  exactly_one_of?: PathExpression[];
  /** true if the slot is to be inversed */
  reversed?: boolean;
  /** the slot to traverse */
  traverse?: SlotDefinitionName;
  /** A range that is described as a boolean expression combining existing ranges */
  range_expression?: AnonymousClassExpression;
}

/**
 * an expression that constrains the range of values a slot can take
 */
export interface SlotExpression extends Expression {
  /** defines the type of the object of the slot.  Given the following slot definition
  S1:
    domain: C1
    range:  C2
the declaration
  X:
    S1: Y

implicitly asserts Y is an instance of C2
 */
  range?: ElementName;
  /** A range that is described as a boolean expression combining existing ranges */
  range_expression?: AnonymousClassExpression;
  /** An inlined enumeration */
  enum_range?: EnumExpression;
  /** true means that the slot must be present in instances of the class definition */
  required?: boolean;
  /** true means that the slot should be present in instances of the class definition, but this is not required */
  recommended?: boolean;
  /** True means that keyed or identified slot appears in an outer structure by value.  False means that only the key or identifier for the slot appears within the domain, referencing a structure that appears elsewhere. */
  inlined?: boolean;
  /** True means that an inlined slot is represented as a list of range instances.  False means that an inlined slot is represented as a dictionary, whose key is the slot key or identifier and whose value is the range instance. */
  inlined_as_list?: boolean;
  /** For ordinal ranges, the value must be equal to or higher than this */
  minimum_value?: Anything;
  /** For ordinal ranges, the value must be equal to or lower than this */
  maximum_value?: Anything;
  /** the string value of the slot must conform to this regular expression expressed in the string */
  pattern?: string;
  /** the string value of the slot must conform to the regular expression in the pattern expression */
  structured_pattern?: PatternExpression;
  /** an encoding of a unit */
  unit?: UnitOfMeasure;
  /** Causes the slot value to be interpreted as a uriorcurie after prefixing with this string */
  implicit_prefix?: string;
  /** if true then a value must be present (for lists there must be at least one value). If false then a value must be absent (for lists, must be empty) */
  value_presence?: string;
  /** the slot must have range string and the value of the slot must equal the specified value */
  equals_string?: string;
  /** the slot must have range string and the value of the slot must equal one of the specified values */
  equals_string_in?: string[];
  /** the slot must have range of a number and the value of the slot must equal the specified value */
  equals_number?: number;
  /** the value of the slot must equal the value of the evaluated expression */
  equals_expression?: string;
  /** the exact number of entries for a multivalued slot */
  exact_cardinality?: number;
  /** the minimum number of entries for a multivalued slot */
  minimum_cardinality?: number;
  /** the maximum number of entries for a multivalued slot */
  maximum_cardinality?: number;
  /** the value of the slot is multivalued with at least one member satisfying the condition */
  has_member?: AnonymousSlotExpression;
  /** the value of the slot is multivalued with all members satisfying the condition */
  all_members?: AnonymousSlotExpression;
  /** holds if none of the expressions hold */
  none_of?: AnonymousSlotExpression[];
  /** holds if only one of the expressions hold */
  exactly_one_of?: AnonymousSlotExpression[];
  /** holds if at least one of the expressions hold */
  any_of?: AnonymousSlotExpression[];
  /** holds if all of the expressions hold */
  all_of?: AnonymousSlotExpression[];
}

export interface AnonymousSlotExpression
  extends AnonymousExpression,
    SlotExpression {}

/**
 * an element that describes how instances are related to other instances
 */
export interface SlotDefinition extends Definition, SlotExpression {
  /** a name that is used in the singular form */
  singular_name?: string;
  /** defines the type of the subject of the slot.  Given the following slot definition
  S1:
    domain: C1
    range:  C2
the declaration
  X:
    S1: Y

implicitly asserts that X is an instance of C1
 */
  domain?: ClassDefinitionName;
  /** URI of the class that provides a semantic interpretation of the slot in a linked data context. The URI may come from any namespace and may be shared between schemas. */
  slot_uri?: string;
  /** true means that slot can have more than one value and should be represented using a list or collection structure. */
  multivalued?: boolean;
  /** coerces the value of the slot into an array and defines the dimensions of that array */
  array?: ArrayExpression;
  /** true means that the *value* of a slot is inherited by subclasses */
  inherited?: boolean;
  /** If present, slot is read only.  Text explains why */
  readonly?: string;
  /** function that provides a default value for the slot.  Possible values for this slot are defined in linkml.utils.ifabsent_functions.default_library:
   * [Tt]rue -- boolean True
   * [Ff]alse -- boolean False
   * bnode -- blank node identifier
   * class_curie -- CURIE for the containing class
   * class_uri -- URI for the containing class
   * default_ns -- schema default namespace
   * default_range -- schema default range
   * int(value) -- integer value
   * slot_uri -- URI for the slot
   * slot_curie -- CURIE for the slot
   * string(value) -- string value */
  ifabsent?: string;
  /** If True, then there must be no duplicates in the elements of a multivalued slot */
  list_elements_unique?: boolean;
  /** If True, then the order of elements of a multivalued slot is guaranteed to be preserved. If False, the order may still be preserved but this is not guaranteed */
  list_elements_ordered?: boolean;
  /** If True, then the relationship between the slot domain and range is many to one or many to many */
  shared?: boolean;
  /** True means that the key slot(s) uniquely identify the elements within a single container */
  key?: boolean;
  /** True means that the key slot(s) uniquely identifies the elements. There can be at most one identifier or key per container */
  identifier?: boolean;
  /** True means that the key slot(s) is used to determine the instantiation (types) relation between objects and a ClassDefinition */
  designates_type?: boolean;
  /** the name used for a slot in the context of its owning class.  If present, this is used instead of the actual slot name. */
  alias?: string;
  /** the "owner" of the slot. It is the class if it appears in the slots list, otherwise the declaring slot */
  owner?: DefinitionName;
  /** the class(es) that reference the slot in a "slots" or "slot_usage" context */
  domain_of?: ClassDefinitionName[];
  /** Ontology property which this slot is a subproperty of.  Note: setting this property on a slot does not guarantee an expansion of the ontological hierarchy into an enumerated list of possible values in every serialization of the model. */
  subproperty_of?: SlotDefinitionName;
  /** If s is symmetric, and i.s=v, then v.s=i */
  symmetric?: boolean;
  /** If s is reflexive, then i.s=i for all instances i */
  reflexive?: boolean;
  /** If s is locally_reflexive, then i.s=i for all instances i where s is a class slot for the type of i */
  locally_reflexive?: boolean;
  /** If s is irreflexive, then there exists no i such i.s=i */
  irreflexive?: boolean;
  /** If s is antisymmetric, and i.s=v where i is different from v, v.s cannot have value i */
  asymmetric?: boolean;
  /** If s is transitive, and i.s=z, and s.s=j, then i.s=j */
  transitive?: boolean;
  /** indicates that any instance of d s r implies that there is also an instance of r s' d */
  inverse?: SlotDefinitionName;
  /** indicates that for any instance, i, the domain of this slot will include an assertion of i s range */
  is_class_field?: boolean;
  /** If s transitive_form_of d, then (1) s holds whenever d holds (2) s is transitive (3) d holds whenever s holds and there are no intermediates, and s is not reflexive */
  transitive_form_of?: SlotDefinitionName;
  /** transitive_form_of including the reflexive case */
  reflexive_transitive_form_of?: SlotDefinitionName;
  /** a textual descriptor that indicates the role played by the slot range */
  role?: string;
  /** True means that this slot was defined in a slot_usage situation */
  is_usage_slot?: boolean;
  /** The name of the slot referenced in the slot_usage */
  usage_slot_name?: string;
  /** the role a slot on a relationship class plays, for example, the subject, object or predicate roles */
  relational_role?: string;
  /** allows for grouping of related slots into a grouping slot that serves the role of a group */
  slot_group?: SlotDefinitionName;
  /** true if this slot is a grouping slot */
  is_grouping_slot?: boolean;
  /** a rule for inferring a slot assignment based on evaluating a path through a sequence of slot assignments */
  path_rule?: PathExpression;
  /** Two classes are disjoint if they have no instances in common, two slots are disjoint if they can never hold between the same two instances */
  disjoint_with?: SlotDefinitionName[];
  /** If true then all direct is_a children are mutually disjoint and share no instances in common */
  children_are_mutually_disjoint?: boolean;
  /** indicates that the domain element consists exactly of the members of the element in the range. */
  union_of?: SlotDefinitionName[];
}

/**
 * A boolean expression that can be used to dynamically determine membership of a class
 */
export interface ClassExpression {
  /** holds if at least one of the expressions hold */
  any_of?: AnonymousClassExpression[];
  /** holds if only one of the expressions hold */
  exactly_one_of?: AnonymousClassExpression[];
  /** holds if none of the expressions hold */
  none_of?: AnonymousClassExpression[];
  /** holds if all of the expressions hold */
  all_of?: AnonymousClassExpression[];
  /** expresses constraints on a group of slots for a class expression */
  slot_conditions?: { [index: SlotDefinitionName]: SlotDefinition };
}

export interface AnonymousClassExpression
  extends AnonymousExpression,
    ClassExpression {
  /** A primary parent class or slot from which inheritable metaslots are propagated from. While multiple inheritance is not allowed, mixins can be provided effectively providing the same thing. The semantics are the same when translated to formalisms that allow MI (e.g. RDFS/OWL). When translating to a SI framework (e.g. java classes, python classes) then is a is used. When translating a framework without polymorphism (e.g. json-schema, solr document schema) then is a and mixins are recursively unfolded */
  is_a?: DefinitionName;
}

/**
 * an element whose instances are complex objects that may have slot-value assignments
 */
export interface ClassDefinition extends Definition, ClassExpression {
  /** collection of slot names that are applicable to a class */
  slots?: SlotDefinitionName[];
  /** the refinement of a slot in the context of the containing class definition. */
  slot_usage?: { [index: SlotDefinitionName]: SlotDefinition };
  /** Inline definition of slots */
  attributes?: { [index: SlotDefinitionName]: SlotDefinition };
  /** URI of the class that provides a semantic interpretation of the element in a linked data context. The URI may come from any namespace and may be shared between schemas */
  class_uri?: string;
  /** DEPRECATED -- rdfs:subClassOf to be emitted in OWL generation */
  subclass_of?: string;
  /** indicates that the domain element consists exactly of the members of the element in the range. */
  union_of?: ClassDefinitionName[];
  /** The combination of is a plus defining slots form a genus-differentia definition, or the set of necessary and sufficient conditions that can be transformed into an OWL equivalence axiom */
  defining_slots?: SlotDefinitionName[];
  /** Indicates that this is the Container class which forms the root of the serialized document structure in tree serializations */
  tree_root?: boolean;
  /** A collection of named unique keys for this class. Unique keys may be singular or compound. */
  unique_keys?: { [index: UniqueKeyUniqueKeyName]: UniqueKey };
  /** the collection of rules that apply to all members of this class */
  rules?: ClassRule[];
  /** The collection of classification rules that apply to all members of this class. Classification rules allow for automatically assigning the instantiated type of an instance. */
  classification_rules?: AnonymousClassExpression[];
  /** if true then induced/mangled slot names are not created for class_usage and attributes */
  slot_names_unique?: boolean;
  /** true if this class represents a relationship rather than an entity */
  represents_relationship?: boolean;
  /** Two classes are disjoint if they have no instances in common, two slots are disjoint if they can never hold between the same two instances */
  disjoint_with?: ClassDefinitionName[];
  /** If true then all direct is_a children are mutually disjoint and share no instances in common */
  children_are_mutually_disjoint?: boolean;
}

/**
 * A rule that is applied to classes
 */
export interface ClassLevelRule {}

/**
 * A rule that applies to instances of a class
 */
export interface ClassRule
  extends ClassLevelRule,
    Extensible,
    Annotatable,
    CommonMetadata {
  /** an expression that must hold in order for the rule to be applicable to an instance */
  preconditions?: AnonymousClassExpression;
  /** an expression that must hold for an instance of the class, if the preconditions hold */
  postconditions?: AnonymousClassExpression;
  /** an expression that must hold for an instance of the class, if the preconditions no not hold */
  elseconditions?: AnonymousClassExpression;
  /** in addition to preconditions entailing postconditions, the postconditions entail the preconditions */
  bidirectional?: boolean;
  /** if true, the the postconditions may be omitted in instance data, but it is valid for an inference engine to add these */
  open_world?: boolean;
  /** the relative order in which the element occurs, lower values are given precedence */
  rank?: number;
  /** a deactivated rule is not executed by the rules engine */
  deactivated?: boolean;
}

/**
 * defines the dimensions of an array
 */
export interface ArrayExpression
  extends Extensible,
    Annotatable,
    CommonMetadata {
  /** exact number of dimensions in the array */
  exact_number_dimensions?: number;
  /** minimum number of dimensions in the array */
  minimum_number_dimensions?: number;
  /** maximum number of dimensions in the array, or False if explicitly no maximum. If this is unset, and an explicit list of dimensions are passed using dimensions, then this is interpreted as a closed list and the maximum_number_dimensions is the length of the dimensions list, unless this value is set to False */
  maximum_number_dimensions?: Anything;
  /** definitions of each axis in the array */
  dimensions?: DimensionExpression[];
}

/**
 * defines one of the dimensions of an array
 */
export interface DimensionExpression
  extends Extensible,
    Annotatable,
    CommonMetadata {
  /** the name used for a slot in the context of its owning class.  If present, this is used instead of the actual slot name. */
  alias?: string;
  /** the maximum number of entries for a multivalued slot */
  maximum_cardinality?: number;
  /** the minimum number of entries for a multivalued slot */
  minimum_cardinality?: number;
  /** the exact number of entries for a multivalued slot */
  exact_cardinality?: number;
}

/**
 * a regular expression pattern used to evaluate conformance of a string
 */
export interface PatternExpression
  extends Extensible,
    Annotatable,
    CommonMetadata {
  /** the string value of the slot must conform to this regular expression expressed in the string. May be interpolated. */
  syntax?: string;
  /** if true then the pattern is first string interpolated */
  interpolated?: boolean;
  /** if not true then the pattern must match the whole string, as if enclosed in ^...$ */
  partial_match?: boolean;
}

/**
 * an expression describing an import
 */
export interface ImportExpression
  extends Extensible,
    Annotatable,
    CommonMetadata {
  import_from: string;
  import_as?: string;
  import_map?: { [index: SettingSettingKey]: Setting };
}

/**
 * assignment of a key to a value
 */
export interface Setting {
  /** the variable name for a setting */
  setting_key: string;
  /** The value assigned for a setting */
  setting_value: string;
}

/**
 * prefix URI tuple
 */
export interface Prefix {
  /** The prefix components of a prefix expansions. This is the part that appears before the colon in a CURIE. */
  prefix_prefix: string;
  /** The namespace to which a prefix expands to. */
  prefix_reference: string;
}

/**
 * an attributed label
 */
export interface LocalName {
  /** the ncname of the source of the name */
  local_name_source: string;
  /** a name assigned to an element in a given ontology */
  local_name_value: string;
}

/**
 * usage example and description
 */
export interface Example {
  /** example value */
  value?: string;
  /** description of what the value is doing */
  description?: string;
  /** direct object representation of the example */
  object?: Anything;
}

/**
 * an attributed description
 */
export interface AltDescription {
  /** the source of an attributed description */
  source: string;
  /** text of an attributed description */
  description: string;
}

/**
 * a permissible value, accompanied by intended text and an optional mapping to a concept URI
 */
export interface PermissibleValue
  extends Extensible,
    Annotatable,
    CommonMetadata {
  /** The actual permissible value itself */
  text: string;
  /** a textual description of the element's purpose and use */
  description?: string;
  /** the value meaning of a permissible value */
  meaning?: string;
  /** an encoding of a unit */
  unit?: UnitOfMeasure;
}

/**
 * a collection of slots whose values uniquely identify an instance of a class
 */
export interface UniqueKey extends Extensible, Annotatable, CommonMetadata {
  /** name of the unique key */
  unique_key_name: string;
  /** list of slot names that form a key. The tuple formed from the values of all these slots should be unique. */
  unique_key_slots: SlotDefinitionName[];
  /** By default, None values are considered equal for the purposes of comparisons in determining uniqueness. Set this to true to treat missing values as per ANSI-SQL NULLs, i.e NULL=NULL is always False. */
  consider_nulls_inequal?: boolean;
}
