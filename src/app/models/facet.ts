import gql from 'graphql-tag';

/**
 * apollo graphQL query fragment to retrieve common fields for a target list view
 */
const FACETFIELDS = gql`
  fragment facetFields on Facet {
    facet
    modifier
    dataType
    binSize
    count
    values {
      name
      count:value
    }
    sourceExplanation
    elapsedTime
  }`;

const FACETFIELDSTOP = gql`
  fragment facetFieldsTop on Facet {
    facet
    dataType
    binSize
    count
    values(top:$facetTop){
      name
      count:value
    }
  }`;

/**
 * field object for facets
 */
export class Field {
  /**
   * facet-able field
   */
  name: string;

  /**
   * facet-able field
   * optional for filter flattening
   */
  value?: string;

  count?: number;


  constructor(json: any) {
    Object.entries((json)).forEach((prop) => this[prop[0]] = prop[1]);
  }
}

/**
 * Facet object from api
 */
export class Facet {

  constructor(json: any) {
    this.count = json.count;
    this.facet = json.facet;
    this.modifier = json.modifier;
    this.sourceExplanation = json.sourceExplanation;
    this.label = json.label;
    this.description = json.description;
    this.dataType = json.dataType;
    this.elapsedTime = json.elapsedTime;
    this.binSize = json.binSize || 1;
    if (this.dataType === 'Numeric') { // set a last point since these are bins, not single points
      this.values = [];
      const keyValues = json.values.map(obj => +obj.name);
      this.min = Math.min(...keyValues);
      this.max = Math.max(...keyValues) + this.binSize;

      for (let num = this.min; num <= this.max; num += this.binSize) {
        num = Math.round(num / this.binSize) * this.binSize;
        const closest = json.values.find(val => Math.abs(+val.name - num) < this.binSize / 10);
        if (closest) {
          this.values.push({name: num.toString(), count: closest.count});
        } else {
          this.values.push({name: num.toString(), count: 0});
        }
      }
    } else {
      this.values = json.values?.map(val => new Field(val)) || [];
      this.upSets = json.upSets || [];
    }
  }

  /**
   * The character what separates the facet name from its options in the query string: note this used to be '/'
   * which messed up the "JAX/MGI Phenotype" facet
   */
  static separator = '!';
  /**
   * fragment of common fields. fetched by the route resolver
   */
  static facetFieldsFragments = FACETFIELDS;

  /**
   * name of facet
   */
  facet: string;
  elapsedTime?: number;

  modifier?: string;

  sourceExplanation?: string;
  /**
   * readable label for facet
   */
  label?: string;

  description?: string;

  /**
   * Total number of facet options under the current settings
   */
  count: number;

  /**
   * list of facet values
   */
  values: Field[];
  upSets: UpsetOptions[];

  dataType = 'Category';
  binSize?: number;
  min?: number;
  max?: number;

  static getReadableParameter(parameter: string, paramValue?: string) {
    if (parameter === 'associatedDisease') {
      return 'Disease Subtree';
    }
    if (parameter === 'associatedTarget') {
      return 'Associated Target';
    }
    if (parameter === 'similarity') {
      return 'Target Similarity';
    }
    if (parameter === 'associatedStructure') {
      if (paramValue.startsWith('sub')) {
        return 'Associated Substructure';
      } else {
        return 'Associated Structure';
      }
    }
    if (parameter === 'associatedLigand') {
      return 'Associated Ligand';
    }
    return parameter;
  }

  /**
   * retrieves a query object for getting all the facet options for a single facet for a list of targets / diseases / ligands
   * @param path
   */
  static getAllFacetOptionsQuery(path) {
    if (path === 'targets') {
      return gql`
        #import "./facetFieldsTop.gql"
        query getAllFacetOptions($batchIDs:[String], $filter:IFilter, $facetTop:Int, $facet:String!){
          results: targets(facets:[$facet], filter:$filter, targets:$batchIDs){
            facets{
              ...facetFieldsTop
            }
          }
        }${FACETFIELDSTOP}`;
    }
    return gql`
      #import "./facetFieldsTop.gql"
      query getAllFacetOptions($filter:IFilter, $facetTop:Int, $facet:String!){
      results: ${path}(filter:$filter){
      facets(include:[$facet]){
      ...facetFieldsTop
      }
      }
      }${FACETFIELDSTOP}`;
  }

  /**
   * retrieves a query object for getting all the facets for a list of targets / diseases / ligands
   * @param path
   */
  static getAllFacetsQuery(path) {
    if (path === 'targets') {
      return gql`
        #import "./facetFields.gql"
        query getAllFacets($batchIDs:[String], $facets:[String!], $filter:IFilter) {
          results: targets(facets:$facets, filter:$filter, targets:$batchIDs) {
            facets {
              ...facetFields
            }
          }
        }${FACETFIELDS}`;
    }
    return gql`
      #import "./facetFields.gql"
      query getAllFacets($facets:[String!], $filter:IFilter) {
      results: ${path}(facets:$facets, filter:$filter) {
      facets {
      ...facetFields
      }
      }
      }${FACETFIELDS}`;
  }
}

export class UpsetOptions {
  inGroup: string[];
  outGroup: string[];

  constructor(inGroup: string[], fullList: string[]) {
    this.inGroup = inGroup;
    this.outGroup = fullList.filter(f => !inGroup.includes(f));
  }


  static parseFromUrl(url: string): UpsetOptions {
    let chunks = url.split('InGroup:');
    chunks = chunks[1].split('OutGroup:');
    const inGroup = decodeURIComponent(chunks[0]).split('&');
    let outGroup = decodeURIComponent(chunks[1]).split('&');
    if (outGroup.length === 1 && outGroup[0].trim() === '') {
      outGroup = [];
    }
    return new UpsetOptions(inGroup, [...inGroup, ...outGroup]);
  }
}
