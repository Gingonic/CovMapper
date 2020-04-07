export type VisualProps = {
  postCodeAreas?: any; 
  postCodePoints?: any; 
  currentDataset: any;
  dataField: string;
}

export type FeatureInfoProps = {
  feature: any; // TODO: use mapbox-gl feature type
  dataField: string;
}