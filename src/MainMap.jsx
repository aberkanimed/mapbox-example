import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MAP_CONFIG from './constant/map-config';

mapboxgl.accessToken = MAP_CONFIG.TOKEN;

function MainTrafficIncident() {
  const mapContainer = useRef(null);
  const [hour, setHour] = useState(0);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.0066, 40.7135],
      zoom: 9,
    });

    newMap.on('load', () => {
      newMap.addLayer({
        id: 'collisions',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './src/data/collisions1601.geojson',
        },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'Casualty']],
            0,
            4,
            5,
            24,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'Casualty']],
            0,
            '#2DC4B2',
            1,
            '#3BB3C3',
            2,
            '#669EC4',
            3,
            '#8B88B6',
            4,
            '#A2719B',
            5,
            '#AA5E79',
          ],
          'circle-opacity': 0.8,
        },
        filter: ['==', ['number', ['get', 'Hour']], 12],
      });
      setMap(newMap);
    });

    return () => newMap && newMap.remove();
  }, []);

  useEffect(() => {
    if (map) {
      // Assuming 'collisions' is a valid layer in your map's style
      map.setFilter('collisions', ['==', ['number', ['get', 'Hour']], hour]);
    }
  }, [hour, map]);

  const handleSliderChange = (event) => {
    setHour(parseInt(event.target.value));
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 ? hour % 12 : 12;
    return `${hour12}${ampm}`;
  };
  return (
    <div className="relative">
      <div ref={mapContainer} className="h-96" />
      <div className="absolute w-60 m-3 px-3 py-5 bg-white top-0">
        <h1 className="font-bold">Motor vehicle collisions</h1>
        <p>
          Data:{' '}
          <a
            className="text-blue-500"
            href="https://data.cityofnewyork.us/Public-Safety/NYPD-Motor-Vehicle-Collisions/h9gi-nx95"
          >
            Motor vehicle collision injuries and deaths
          </a>{' '}
          in NYC, Jan 2016
        </p>
        <div className="session">
          <h2>Casualty</h2>
          <div className="row colors"></div>
          <div className="row labels">
            <div className="label">0</div>
            <div className="label">1</div>
            <div className="label">2</div>
            <div className="label">3</div>
            <div className="label">4</div>
            <div className="label">5+</div>
          </div>
        </div>
        <div className="session" id="sliderbar">
          <h2>
            Hour: <label id="active-hour">{formatHour(hour)}</label>
          </h2>
          <input
            id="slider"
            className="row"
            onChange={handleSliderChange}
            type="range"
            min="0"
            max="23"
            step="1"
            value={hour}
          />
        </div>
      </div>
    </div>
  );
}

export default MainTrafficIncident;
