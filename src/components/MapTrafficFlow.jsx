import { useRef, useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import MAP_CONFIG from '../constant/map-config';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = MAP_CONFIG.TOKEN;

function MapTrafficFlow() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/light-v11', // style URL
      center: [-4.418532667037596, 36.71797108163557], // starting position [lng, lat]
      zoom: 17.5, // starting zoom
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
          'line-color': 'red',
          'line-width': 2,
          'line-opacity': 0.4,
        },
      });

      // add a line layer with line-dasharray set to the first value in dashArraySequence
      newMap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line-dashed',
        paint: {
          'line-color': 'red',
          'line-width': 2,
          'line-dasharray': [0, 4, 3],
        },
      });

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
        // Update line-dasharray using the next value in dashArraySequence. The
        // divisor in the expression `timestamp / 50` controls the animation speed.
        const newStep = parseInt((timestamp / 50) % dashArraySequence.length);

        if (newStep !== step) {
          newMap.setPaintProperty(
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

      setMap(newMap);
    });

    return () => newMap && newMap.remove();
  }, []);

  return (
    <Card>
      <div ref={mapContainer} className="h-96" />
    </Card>
  );
}

export default MapTrafficFlow;
