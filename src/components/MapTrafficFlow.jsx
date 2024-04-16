import { useRef, useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import MAP_CONFIG from '../constant/map-config';
import mapboxgl from 'mapbox-gl';
import TrafficModeChart from './TrafficModeChart';
import TrafficFunnelChart from './TrafficAreaChart';

mapboxgl.accessToken = MAP_CONFIG.TOKEN;

function MapTrafficFlow() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [trafficMode, setTrafficMode] = useState('private');

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
      center: [-4.440686314614567, 36.698543669674464], // starting position [lng, lat]
      zoom: 17, // starting zoom
    });

    newMap.on('load', () => {
      newMap.addSource('line', {
        type: 'geojson',
        data: './src/data/trafficFlow.geojson',
      });

      // add a line layer without line-dasharray defined to fill the gaps in the dashed line
      newMap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line-background',
        paint: {
          'line-color': [
              'match', ['get', 'traffic_flow'],
              'smooth', 'green',
              'moderate', 'orange',
              'congested', 'red',
              'gray'
            ],
          'line-width': 9,
          'line-opacity': 0.4,
        },
        filter: ['==', ['string', ['get', 'transport_mode']], trafficMode],
      });

      // add a line layer with line-dasharray set to the first value in dashArraySequence
      newMap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line-dashed',
        paint: {
          'line-color': [
              'match', ['get', 'traffic_flow'],
              'smooth', 'green',
              'moderate', 'orange',
              'congested', 'red',
              'gray'
            ],
          'line-width': 9,
          'line-dasharray': [0, 4, 3],
        },
        filter: ['==', ['string', ['get', 'transport_mode']], trafficMode],
      });


      setMap(newMap);
    });

    return () => newMap && newMap.remove();
  }, []);

  useEffect(() => {
    if(map) {
      const dashArraySequence = [
        [0, 4, 3],
        [0.5, 4, 2.5],
        [1, 4, 2],
        [1.5, 4, 1.5],
        [2, 4, 1],
        [2.5, 4, 0.5],
        [3, 4, 0],
        [0, 0.5, 3, 3.5],
        [0, 1, 3, 3],
        [0, 1.5, 3, 2.5],
        [0, 2, 3, 2],
        [0, 2.5, 3, 1.5],
        [0, 3, 3, 1],
        [0, 3.5, 3, 0.5],
      ];

      let step = 0;

      const animateDashArray = (timestamp) => {
        const newStep = parseInt((timestamp / 50) % dashArraySequence.length);

        if (newStep !== step) {
          map.setPaintProperty('line-dashed', 'line-dasharray', dashArraySequence[step]);
          step = newStep;
        }

        requestAnimationFrame(animateDashArray);
      };

      animateDashArray(0);
    }
  }, [map])

useEffect(() => {
    if (map) {
      // Assuming 'collisions' is a valid layer in your map's style
      map.setFilter('line-dashed', ['==', ['string', ['get', 'transport_mode']], trafficMode]);
      map.setFilter('line-background', ['==', ['string', ['get', 'transport_mode']], trafficMode]);
    }
  }, [trafficMode, map]);

  const handleOptionChange = (event) => {
    // Update the selected option when a radio button is changed
    setTrafficMode(event.target.value);
  };

  return (
    <>
      <Card>
        <div className="relative">
        <div ref={mapContainer} className="h-80" />
        <div className="absolute w-60 m-3 px-3 py-5 bg-white top-0">
          <h2 className="font-bold">Traffic Flow</h2>
          <div className='flex gap-2'>
            <div className='flex flex-col'>
              <label className='text-xs'>Smooth</label>
              <div className='h-3 w-12 bg-green-600'></div>
            </div>
            <div className='flex flex-col'>
              <label className='text-xs'>Moderate</label>
              <div className='h-3 w-12 bg-orange-600'></div>
            </div>
            <div className='flex flex-col'>
              <label className='text-xs'>Congestion</label>
              <div className='h-3 w-12 bg-red-600'></div>
            </div>
          </div>
          <div className='mt-2'>
            <h2 className="font-bold">
              Traffic Mode
            </h2>
            <div className='mt-2 flex gap-2'>
              <label>
                <input
                  type="radio"
                  value="private"
                  checked={trafficMode === 'private'}
                  onChange={handleOptionChange}
                />
                Private
              </label>
              <label>
                <input
                  type="radio"
                  value="public"
                  checked={trafficMode === 'public'}
                  onChange={handleOptionChange}
                />
                Public
              </label>
            </div>
          </div>
        </div>
      </div>
      </Card>
      <div className='flex gap-x-5 mt-5'>
        <TrafficModeChart></TrafficModeChart>
        <TrafficFunnelChart></TrafficFunnelChart>
      </div>
    </>
  );
}

export default MapTrafficFlow;
