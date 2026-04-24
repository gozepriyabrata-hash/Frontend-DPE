import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  MapPin, 
  CloudRain, 
  Sun, 
  Car, 
  Info, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Wind,
  LocateFixed
} from 'lucide-react';
import api from '../services/api';
import OlaRouteMap from '../components/OlaRouteMap';
import Vehicle3DCard from '../components/Vehicle3DCard';


const CabEngine = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestId] = useState('');
  const [preSourceCoords, setPreSourceCoords] = useState(null);
  const [preDestCoords, setPreDestCoords] = useState(null);
  
  const [mapTrigger, setMapTrigger] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // 'source' or 'destination'
  
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);
  
  // Simulation Toggles
  const [simWeather, setSimWeather] = useState('AUTO');
  const [simTraffic, setSimTraffic] = useState(1.0);
  const containerRef = useRef(null);

  // Fetch suggestions when typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = activeInput === 'source' ? source : destination;
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await api.get(`/cab/autocomplete?input=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [source, destination, activeInput]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const res = await api.get(`/cab/reverse-geocode?lat=${lat}&lng=${lng}`);
        setSource(res.data.address);
        setSourceId(res.data.placeId);
        setPreSourceCoords(`${lat},${lng}`);
        setMapTrigger(v => v + 1);
        setEstimate(null); // Clear old route
      } catch (err) {
        console.error("Location detect error", err);
        alert("Failed to reverse-geocode your location");
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error(error);
      alert("Unable to retrieve your location");
      setLoading(false);
    });
  };

  const handleCalculate = async () => {
    if (!source || !destination) return;
    
    setLoading(true);
    try {
      const res = await api.post('/cab/estimate', {
        source,
        destination,
        sourceId,
        destId,
        simulateWeather: simWeather,
        simulateTraffic: simTraffic
      });
      setEstimate(res.data);
      setMapTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Estimate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = async (suggestion) => {
    // Clear old result and trigger when selecting new location
    setEstimate(null);
    setMapTrigger(v => v + 1);

    if (activeInput === 'source') {
      setSource(suggestion.name);
      setSourceId(suggestion.placeId);
      // Fetch coords immediately for map auto-focus
      try {
        const res = await api.get(`/cab/place-details?placeId=${suggestion.placeId}`);
        if (res.data.coords) setPreSourceCoords(res.data.coords);
      } catch (err) { console.error(err); }
    } else {
      setDestination(suggestion.name);
      setDestId(suggestion.placeId);
      // Fetch coords immediately for map auto-focus
      try {
        const res = await api.get(`/cab/place-details?placeId=${suggestion.placeId}`);
        if (res.data.coords) setPreDestCoords(res.data.coords);
      } catch (err) { console.error(err); }
    }
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-neo-bg p-4 md:p-10 font-neo relative">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-6 border-neo-black pb-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none">
              CAB <span className="text-neo-pink">SURGE</span>
            </h1>
            <p className="max-w-xl font-bold bg-white border-3 border-neo-black p-4 shadow-brutal translate-x-1 translate-y-1">
              REAL-TIME ALGORITHMIC FARE CALCULATOR. INTEGRATED WITH OLA MAPS & WEATHER SENSORS.
            </p>
          </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border-4 border-neo-black p-8 shadow-brutal relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-neo-cyan border-l-4 border-b-4 border-neo-black -mr-12 -mt-12 rotate-45" />
              
              <div className="space-y-6 relative z-10">
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 font-black text-sm uppercase">
                      <MapPin className="w-4 h-4 text-neo-pink" strokeWidth={3} /> Pickup Location
                    </label>
                    <button 
                      onClick={detectLocation}
                      className="flex items-center gap-1 text-[10px] font-black uppercase text-neo-black bg-neo-yellow border-2 border-neo-black px-2 py-1 shadow-[2px_2px_0px_#121212] hover:bg-neo-cyan active:scale-95 transition-all"
                    >
                      <LocateFixed className="w-3 h-3" /> Auto
                    </button>
                  </div>
                  <input 
                    className="w-full bg-neo-bg border-3 border-neo-black p-4 font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-brutal-sm transition-all"
                    placeholder="ENTER PICKUP..."
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    onFocus={() => setActiveInput('source')}
                    onBlur={() => setTimeout(() => setActiveInput(null), 200)}
                  />
                  <AnimatePresence>
                    {activeInput === 'source' && suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute z-20 top-[105%] left-0 right-0 bg-white border-4 border-neo-black shadow-brutal max-h-48 overflow-y-auto"
                      >
                        {suggestions.map((s, i) => (
                          <button 
                            key={i} onClick={() => selectSuggestion(s)}
                            className="block w-full text-left p-3 overflow-hidden hover:bg-neo-cyan border-b-2 border-neo-black last:border-0"
                          >
                            <div className="font-black text-sm truncate">{s.mainText || s.name}</div>
                            {s.secondaryText && <div className="font-bold text-xs text-gray-700 truncate mt-0.5">{s.secondaryText}</div>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 font-black text-sm uppercase mb-3">
                    <Navigation className="w-4 h-4 text-neo-green" strokeWidth={3} /> Destination
                  </label>
                  <input 
                    className="w-full bg-neo-bg border-3 border-neo-black p-4 font-bold placeholder:text-gray-400 focus:outline-none focus:shadow-brutal-sm transition-all"
                    placeholder="ENTER DROP..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setActiveInput('destination')}
                    onBlur={() => setTimeout(() => setActiveInput(null), 200)}
                  />
                   <AnimatePresence>
                    {activeInput === 'destination' && suggestions.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute z-20 top-[105%] left-0 right-0 bg-white border-4 border-neo-black shadow-brutal max-h-48 overflow-y-auto"
                      >
                        {suggestions.map((s, i) => (
                          <button 
                            key={i} onClick={() => selectSuggestion(s)}
                            className="block w-full text-left p-3 overflow-hidden hover:bg-neo-cyan border-b-2 border-neo-black last:border-0"
                          >
                            <div className="font-black text-sm truncate">{s.mainText || s.name}</div>
                            {s.secondaryText && <div className="font-bold text-xs text-gray-700 truncate mt-0.5">{s.secondaryText}</div>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={handleCalculate}
                  disabled={loading}
                  className="w-full bg-neo-black text-white py-5 font-display font-black text-xl uppercase tracking-widest hover:bg-neo-pink transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'CALCULATING...' : 'GET ESTIMATES'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!estimate ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-10 border-4 border-dashed border-neo-black opacity-30 bg-neo-gray"
                >
                  <Car className="w-20 h-20 mb-4" strokeWidth={1} />
                  <p className="font-display font-black text-2xl uppercase">System Idle</p>
                  <p className="font-bold text-sm">Waiting for trip parameters...</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 pb-10"
                >
                  {/* Interactive Ola Map */}
                  <div className="w-full">
                    <OlaRouteMap 
                      sourceCoords={estimate?.trip?.sourceCoords || preSourceCoords}
                      destCoords={estimate?.trip?.destCoords || preDestCoords}
                      routePolyline={estimate?.trip?.polyline}
                      mapTrigger={mapTrigger}
                    />
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border-3 border-neo-black p-4 shadow-brutal-sm">
                      <p className="text-[10px] font-black uppercase text-gray-500">Distance</p>
                      <p className="text-2xl font-display font-black uppercase">{estimate.trip.distance} km</p>
                    </div>
                    <div className="bg-white border-3 border-neo-black p-4 shadow-brutal-sm">
                      <p className="text-[10px] font-black uppercase text-gray-500">ETA</p>
                      <p className="text-2xl font-display font-black uppercase">{estimate.trip.duration} min</p>
                    </div>
                    <div className="bg-neo-green border-3 border-neo-black p-4 shadow-brutal-sm">
                      <p className="text-[10px] font-black uppercase text-neo-black">Traffic</p>
                      <p className="text-2xl font-display font-black uppercase">{estimate.trip.trafficStatus}</p>
                    </div>
                    <div className={`border-3 border-neo-black p-4 shadow-brutal-sm ${estimate.trip.weather === 'CLEAR' ? 'bg-white' : 'bg-neo-yellow'}`}>
                      <p className="text-[10px] font-black uppercase text-gray-500">Weather</p>
                      <div className="flex items-center gap-2">
                        {estimate.trip.weather === 'CLEAR' ? <Sun className="w-5 h-5" /> : <CloudRain className="w-5 h-5" />}
                        <p className="text-2xl font-display font-black uppercase">{estimate.trip.weather}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Cards */}
                  <React.Suspense fallback={<div className="p-10 text-center font-black uppercase bg-white border-4 border-neo-black shadow-brutal">Generating Real-Time Estimates...</div>}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {estimate.estimates.map((opt) => (
                      <motion.div 
                        key={opt.type}
                        whileHover={{ y: -5, x: -5 }}
                        className="bg-white border-4 border-neo-black shadow-brutal flex flex-col group cursor-default transition-all overflow-hidden"
                      >
                        {/* 3D Vehicle Showcase */}
                        <Vehicle3DCard type={opt.type} />

                        <div className="p-6 flex flex-col justify-between flex-1">
                          <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="bg-neo-black text-white inline-block px-2 py-0.5 text-[10px] font-black uppercase mb-2">
                              {opt.type}
                            </div>
                            <h3 className="text-3xl font-display font-black uppercase leading-none">{opt.label}</h3>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Estimated Fare</p>
                             <p className="text-4xl font-display font-black leading-none text-neo-pink">₹{opt.estimatedFare}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm font-bold mb-6 text-gray-600 italic">"{opt.description}"</p>

                        <div className="flex items-center justify-between pt-4 border-t-2 border-neo-black border-dashed">
                          {opt.isSurgeActive ? (
                            <div className="flex items-center gap-2 text-neo-pink">
                              <TrendingUp className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase">{opt.surgeMultiplier}x Surge Applied</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black uppercase text-neo-green">Standard Pricing</span>
                          )}
                          <button className="bg-neo-cyan border-2 border-neo-black px-4 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_#121212] group-hover:bg-neo-yellow transition-colors">
                            SELECT
                          </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    </div>
                  </React.Suspense>

                  {/* Legend / Info */}
                  <div className="bg-neo-black text-white p-6 shadow-brutal flex items-start gap-4">
                    <Info className="w-6 h-6 shrink-0 text-neo-cyan" />
                    <div className="text-xs space-y-1">
                      <p className="font-black uppercase text-neo-cyan">Dynamic Pricing Mechanism Details</p>
                      <p className="opacity-80">Our engine recalculates fares every 3.5 seconds based on local supply/demand density, weather precipitation from satellite sensors, and real-time traffic offsets provided by Ola Maps.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabEngine;
