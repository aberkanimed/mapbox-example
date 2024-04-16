import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MAP_CONFIG from '../constant/map-config';
import LineChart from './charts/charTrafficIncident';

mapboxgl.accessToken = MAP_CONFIG.TOKEN;

function MainTrafficIncident() {
  const mapContainer = useRef(null);
  const [hour, setHour] = useState(0);
  const [map, setMap] = useState(null);
  const [month, setMonth] = useState(1);

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-4.428873, 36.71911],
      zoom: 12.5,
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

      // Add click event listener to map
      newMap.on('click', 'collisions', (e) => {
        const features = e.features;
        if (features.length) {
          const feature = features[0];
          const coordinates = feature.geometry.coordinates.slice();
          const casualty = feature.properties.Casualty;
          const hour = feature.properties.Hour;
          const injured = feature.properties.Injured;
          const day = feature.properties.Day;
          const killed = feature.properties.Killed;
          const factor = feature.properties.Factor1;
          const popupContent = `
          <div style="padding: 10px; background-color: white; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
          <h3>Casualty: ${casualty}</h3><p>Hour: ${hour}</p> <p>Day: ${day}</p> <p>Injured: ${injured}</p> <p>Killed: ${killed}</p> <p>Factor: ${factor}</p> </div>`;
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(newMap);
        }
      });
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
  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 ? hour % 12 : 12;
    return `${hour12}${ampm}`;
  };

  return (
    <div className="relative">
      <div
        className="session"
        style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
        id="monthDropdown"
      >
        <h2>
          <b>Month:</b>
        </h2>
        <select onChange={handleMonthChange} value={month}>
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
      </div>
      <div ref={mapContainer} className="h-96" />
      <div className="absolute w-60 m-3 px-3 py-5 bg-white top-0">
        <h1 className="font-bold">Traffic incidents</h1>
        <p>
          Data:{' '}
          <a
            className="text-blue-500"
            href="https://data.cityofnewyork.us/Public-Safety/NYPD-Motor-Vehicle-Collisions/h9gi-nx95"
          >
            Pedestrian and vehicle collision injuries and deaths
          </a>{' '}
          in Málaga, Jan 2024
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
      <LineChart />
    </div>
  );
}

export default MainTrafficIncident;
