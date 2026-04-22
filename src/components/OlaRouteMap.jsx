import React, { useEffect, useRef, useMemo, useState } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import polyline from '@mapbox/polyline';

const OLA_API_KEY = 'pn86qmyjSCTYkBFHfbr0l8ITFNmZmd3AnfVLGP7p';
const OLA_STYLE_URL = `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${OLA_API_KEY}`;

// Ola Maps style.json internally sets "key=0.0.1" on tile/sprite/glyph URLs.
// We must replace that with the real API key on every outgoing request.
const transformRequest = (url, resourceType) => {
  if (url && url.includes('olamaps.io')) {
    // Replace the bogus key=0.0.1 with the real api_key
    let fixedUrl = url.replace(/key=0\.0\.1/, `key=${OLA_API_KEY}`);
    // Also ensure api_key param exists
    if (!fixedUrl.includes('api_key=')) {
      const separator = fixedUrl.includes('?') ? '&' : '?';
      fixedUrl = `${fixedUrl}${separator}api_key=${OLA_API_KEY}`;
    }
    return { url: fixedUrl };
  }
  return { url };
};

const OlaRouteMap = ({ sourceCoords, destCoords, routePolyline, mapTrigger }) => {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: 77.5946,
    latitude: 12.9716,
    zoom: 11
  });
  const [cleanStyle, setCleanStyle] = useState(null);

  // Clean the style JSON to remove non-existent 3D layers that cause console errors
  useEffect(() => {
    fetch(OLA_STYLE_URL)
      .then(res => res.json())
      .then(style => {
        if (style.layers) {
          style.layers = style.layers.filter(layer => 
            !layer.id.includes('3d_model') && layer.source !== '3d_model'
          );
        }
        setCleanStyle(style);
      })
      .catch(err => {
        console.error("Style fetch error:", err);
        setCleanStyle(OLA_STYLE_URL); // Fallback to raw URL
      });
  }, []);

  // Parse coords "lat,lng" to { lat, lng }
  const src = useMemo(() => {
    if (!sourceCoords || typeof sourceCoords !== 'string') return null;
    const parts = sourceCoords.split(',').map(Number);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    return { lat: parts[0], lng: parts[1] };
  }, [sourceCoords]);

  const dst = useMemo(() => {
    if (!destCoords || typeof destCoords !== 'string') return null;
    const parts = destCoords.split(',').map(Number);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    return { lat: parts[0], lng: parts[1] };
  }, [destCoords]);

  // Decode the polyline into GeoJSON
  const lineGeoJSON = useMemo(() => {
    if (!routePolyline) return null;
    try {
      const decoded = polyline.decode(routePolyline).map(([lat, lng]) => [lng, lat]);
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: decoded
        }
      };
    } catch (e) {
      console.error("Polyline decode error", e);
      return null;
    }
  }, [routePolyline]);

  // Fit map bounds when coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    console.log("Map Auto-Focus Triggered:", { src, dst, mapTrigger });

    const doFocus = () => {
      if (src && dst) {
        // If they are identical, just center and zoom
        if (src.lat === dst.lat && src.lng === dst.lng) {
          map.flyTo({ center: [src.lng, src.lat], zoom: 14, duration: 1500 });
        } else {
          const minLng = Math.min(src.lng, dst.lng);
          const maxLng = Math.max(src.lng, dst.lng);
          const minLat = Math.min(src.lat, dst.lat);
          const maxLat = Math.max(src.lat, dst.lat);

          map.fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { 
              padding: { top: 80, bottom: 80, left: 80, right: 80 }, 
              duration: 1500,
              essential: true
            }
          );
        }
      } else if (src) {
        map.flyTo({ center: [src.lng, src.lat], zoom: 13, duration: 1200 });
      } else if (dst) {
        map.flyTo({ center: [dst.lng, dst.lat], zoom: 13, duration: 1200 });
      }
    };

    // Use a small delay to ensure map is responsive
    const timer = setTimeout(doFocus, 300);
    return () => clearTimeout(timer);
  }, [src, dst, mapTrigger]);

  return (
    <div className="w-full border-4 border-neo-black shadow-brutal bg-white overflow-hidden relative" style={{ height: 420 }}>
      
      {/* Brutalist Label */}
      <div className="absolute top-4 left-4 z-10 bg-neo-pink border-3 border-neo-black px-3 py-1 font-display font-black text-white uppercase text-sm shadow-[2px_2px_0px_#121212]">
        Live Map Tracker
      </div>

      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={cleanStyle || OLA_STYLE_URL}
        transformRequest={transformRequest}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        <NavigationControl position="bottom-right" />

        {/* Route Outline (black border behind the pink line) */}
        {lineGeoJSON && (
          <Source id="route-outline" type="geojson" data={lineGeoJSON}>
            <Layer 
              id="route-line-outline" 
              type="line" 
              paint={{
                'line-color': '#121212',
                'line-width': 9,
                'line-opacity': 1
              }} 
            />
          </Source>
        )}

        {/* Route Line (neo-pink on top) */}
        {lineGeoJSON && (
          <Source id="route" type="geojson" data={lineGeoJSON}>
            <Layer 
              id="route-line" 
              type="line" 
              paint={{
                'line-color': '#FF007F',
                'line-width': 5,
                'line-opacity': 0.9
              }} 
            />
          </Source>
        )}

        {/* Source Marker */}
        {src && (
          <Marker longitude={src.lng} latitude={src.lat} anchor="bottom">
            <div className="bg-neo-green border-3 border-neo-black px-3 py-1.5 shadow-brutal-sm font-black text-xs uppercase tracking-wider">
              📍 PICKUP
            </div>
          </Marker>
        )}

        {/* Destination Marker */}
        {dst && (
          <Marker longitude={dst.lng} latitude={dst.lat} anchor="bottom">
            <div className="bg-neo-cyan border-3 border-neo-black px-3 py-1.5 shadow-brutal-sm font-black text-xs uppercase tracking-wider">
              🏁 DROP
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
};

export default OlaRouteMap;
