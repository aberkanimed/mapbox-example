import { useRef, useEffect, useState } from 'react';
import { Card } from '@tremor/react';
import MAP_CONFIG from '../constant/map-config';
import mapboxgl from 'mapbox-gl';
import CrowdedAreaAlert from './CrowdedAreaAlert';
import CrowdedAreaBarChart from './CrowdedAreaBarChart';

mapboxgl.accessToken = MAP_CONFIG.TOKEN;

function CrowdedArea() {
    const chartdataArr = [
        [
            {
                hour: '6a',
                density: 10,
            },
            {
                hour: '7a',
                density: 21,
            },
            {
                hour: '8a',
                density: 29,
            },
            {
                hour: '8a',
                density: 27,
            },
            {
                hour: '10a',
                density: 35,
            },
            {
                hour: '11a',
                density: 47,
            },
            {
                hour: '12a',
                density: 51,
            },
            {
                hour: '1p',
                density: 65,
            },
            {
                hour: '2p',
                density: 40,
            },
            {
                hour: '3p',
                density: 51,
            },
            {
                hour: '4p',
                density: 60,
            },
            {
                hour: '5p',
                density: 76,
            },
            {
                hour: '6p',
                density: 88,
            },
            {
                hour: '7p',
                density: 87,
            },
        ],
        [
            {
                hour: '6a',
                density: 17,
            },
            {
                hour: '7a',
                density: 10,
            },
            {
                hour: '8a',
                density: 30,
            },
            {
                hour: '8a',
                density: 25,
            },
            {
                hour: '10a',
                density: 45,
            },
            {
                hour: '11a',
                density: 66,
            },
            {
                hour: '12a',
                density: 77,
            },
            {
                hour: '1p',
                density: 62,
            },
            {
                hour: '2p',
                density: 54,
            },
            {
                hour: '3p',
                density: 42,
            },
            {
                hour: '4p',
                density: 68,
            },
            {
                hour: '5p',
                density: 75,
            },
            {
                hour: '6p',
                density: 89,
            },
            {
                hour: '7p',
                density: 95,
            },
        ]
    ];
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [chartData, setChartData] = useState(chartdataArr[0]);
  const [indexArr, setIndexArr] = useState(false);

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
      center: [-4.428507310690236,
        36.718677550697464], // starting position [lng, lat]
      zoom: 15.5, // starting zoom
    });

    newMap.on('load', () => {
      newMap.addSource('crowdedAreas', {
        type: 'geojson',
        data: './src/data/crowdedAreas.geojson',
      });

      newMap.addLayer(
        {
          id: 'trees-heat',
          type: 'heatmap',
          source: 'crowdedAreas',
          maxzoom: 19,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'crowd_density',
              type: 'exponential',
              stops: [
                [1, 0],
                [65, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              stops: [
                [11, 1],
                [15, 3]
              ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(236,222,239,0)',
                0.2,
                'rgb(255,0,0)',       // Red
                0.4,
                'rgb(255,69,0)',      // Orange-Red
                0.6,
                'rgb(255,128,0)',     // Orange
                0.8,
                'rgb(255,215,0)',     // Gold
                1,
                'rgb(255,255,0)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            }
          }
        },
        'waterway-label'
      );

      newMap.addLayer(
        {
          id: 'trees-point',
          type: 'circle',
          source: 'crowdedAreas',
          minzoom: 17,
          paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
              property: 'crowd_density',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
              ]
            },
            'circle-color': {
              property: 'crowd_density',
              type: 'exponential',
              stops: [
                [0, 'rgba(236,222,239,0)'],
                [10, 'rgb(236,222,239)'],
                [20, 'rgb(208,209,230)'],
                [30, 'rgb(166,189,219)'],
                [40, 'rgb(103,169,207)'],
                [50, 'rgb(28,144,153)'],
                [60, 'rgb(1,108,89)']
              ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
              stops: [
                [14, 0],
                [15, 1]
              ]
            }
          }
        },
        'waterway-label'
      );


      setMap(newMap);
    });

    return () => newMap && newMap.remove();
  }, []);

  useEffect(() => {
    if(map) {
        map.on('click', 'trees-point', (event) => {
            setChartData(chartdataArr[toggleIndex()])
          });
    }
  }, [chartData, map])

  function toggleIndex() {
    if (indexArr) {
        setIndexArr(!indexArr)
        return 1
    } else {
        setIndexArr(!indexArr)
        return 0
    }
  }


  return (
    <>
        <CrowdedAreaAlert></CrowdedAreaAlert>
        <div className='mt-5 flex gap-4'>
            <Card>
                <div ref={mapContainer} className="h-80" />
            </Card>
            <CrowdedAreaBarChart chartdata={chartData}></CrowdedAreaBarChart>
        </div>
    </>
  );
}

export default CrowdedArea;
