import { useRef, useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import MAP_CONFIG from '../constant/map-config';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = MAP_CONFIG.TOKEN;

function MapTrafficFlow() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [transportMode, setTransportMode] = useState("public");

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
        filter: ['==', ['string', ['get', 'transport_mode']], 'private'],
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
        filter: ['==', ['string', ['get', 'transport_mode']], 'private'],
        metadata: {
          'transport_flow': [
              'match', ['get', 'traffic_flow'],
              'smooth', 'smooth',
              'moderate', 'moderate',
              'congested', 'congested',
              'smooth'
          ]
        },
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
        // Get the transport_flow value from the GeoJSON properties
        const transportFlow = map.getLayer('line-dashed').metadata.transport_flow;

        // Define a speed multiplier based on the transport_flow value
        let speedMultiplier;
        switch (transportFlow) {
          case 'smooth':
            console.log(transportFlow);
            speedMultiplier = 20; // Adjust as needed for smooth flow
            break;
          case 'moderate':
            console.log(transportFlow);
            speedMultiplier = 65; // Adjust as needed for moderate flow
            break;
          case 'congested':
            console.log(transportFlow);
            speedMultiplier = 100; // Adjust as needed for congested flow
            break;
          default:
            console.log(transportFlow);
            speedMultiplier = 50; // Default speed multiplier
        }
        const newStep = parseInt((timestamp / speedMultiplier) % dashArraySequence.length);

        if (newStep !== step) {
          map.setPaintProperty(
            'line-dashed',
            'line-dasharray',
            dashArraySequence[step]
          );
          step = newStep;
        }

        // Request the next frame of the animation.
        requestAnimationFrame(animateDashArray);
      };

      animateDashArray(0);
    }
  }, [map])

/*   useEffect(() => {
    if (map) {
      // Assuming 'collisions' is a valid layer in your map's style
      map.setFilter('collisions', ['==', ['text', ['get', 'transport_mode']], transportMode]);
    }
  }, [transport_mode, map]); */

  return (
    <Card>
      <div ref={mapContainer} className="h-96" />
    </Card>
  );
}

export default MapTrafficFlow;
