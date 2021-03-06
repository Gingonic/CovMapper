import React, { Suspense, memo } from 'react'
import { useSelector } from "react-redux";
import { LazyError } from './LazyError'
const Popup = React.lazy(() => import(/* webpackChunkName: "mapgl" */ 'react-map-gl/dist/es6/components/popup')
  .catch(() => ({ default: LazyError })));

import { State } from "src/state";
import { formatUTCDate } from 'src/lib/formatUTCDate.js'
import { getFallbackComponent } from './getFallback';
import { AppApi } from "src/state/app";
import { useThunkDispatch } from "src/useThunkDispatch";
import { config } from 'app-config/index'

export const FeatureInfo = memo(() => {
  const dispatch = useThunkDispatch();
  const currentFeature = useSelector((state: State) => state.app.currentFeature);
  const datasetFound = useSelector((state: State) => state.app.datasetFound);
  const currentVisual = useSelector((state: State) => state.app.currentVisual);
  const datasets = useSelector((state: State) => state.app.datasets);
  const currentDate = useSelector((state: State) => state.app.currentDate);
  const currentLayerGroup = useSelector((state: State) => state.app.currentLayerGroup);
  const currentMappable = useSelector((state: State) => state.app.currentMappable);
  
  if (!currentFeature.feature || !datasetFound) {
    return null
  }

  const visual = config.visuals[currentVisual]
  // TODO: Select data correctly from a dataset for info here
  const mappingId = Object.keys(visual.mappings)[0] // <-
  const activeMapping = visual.mappings[mappingId]
  const timeKey = formatUTCDate(currentDate)
  const currentDataSet = datasets.get(`${timeKey}-${activeMapping.datasourceId}`)

  const InfoComponent = currentLayerGroup.FeatureInfo
  let rawData: any = null
  if (currentDataSet) {
    rawData = currentDataSet.data[currentFeature.feature.properties[activeMapping.geoProperty]]
  }

  if (!rawData) {
    return null
  }
  
  const onClose = () => dispatch(AppApi.setCurrentFeature(null))

  return (
    <Suspense fallback={getFallbackComponent()}>
      <Popup
        latitude={(currentFeature as any).lngLat[1]}
        longitude={(currentFeature as any).lngLat[0]}
        closeButton={false}
        closeOnClick={true}
        onClose={onClose}
        anchor="top"
        style={{ zIndex: 1100 }}
      >
        <InfoComponent 
          feature={currentFeature.feature} 
          dataField={currentMappable.property} 
          timeKey={timeKey} 
          rawData={rawData} 
          onClose={onClose}
        />
      </Popup>
    </Suspense>
  )
})