import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, GripVertical, Save, Upload, Settings } from 'lucide-react';

const OpenTTDNewGRFBuilder = () => {
  const [selectedCountry, setSelectedCountry] = useState('taiwan');
  const [selectedIndustry, setSelectedIndustry] = useState('firs-steeltown');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [customNewGRFs, setCustomNewGRFs] = useState([]);
  const [loadOrder, setLoadOrder] = useState([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('other');
  const [saveSlots, setSaveSlots] = useState([]);
  const [currentSaveName, setCurrentSaveName] = useState('');

  // Länder-Sets
  const countries = {
    taiwan: { name: 'Taiwan 🇹🇼', climate: 'tropical' },
    germany: { name: 'Deutschland 🇩🇪', climate: 'temperate' },
    uk: { name: 'England 🇬🇧', climate: 'temperate' },
    usa: { name: 'Amerika 🇺🇸', climate: 'temperate' },
    china: { name: 'China 🇨🇳', climate: 'subtropical' },
    japan: { name: 'Japan 🇯🇵', climate: 'temperate' },
    korea: { name: 'Korea 🇰🇷', climate: 'temperate' },
    scandinavia: { name: 'Skandinavien 🇸🇪', climate: 'arctic' }
  };

  // Industrie-Sets
  const industries = {
    'firs-steeltown': { 
      name: 'FIRS Steeltown', 
      difficulty: 'medium',
      description: 'Schwerindustrie, Elektronik, perfekt für Taiwan',
      grfs: ['FIRS Industry Replacement Set 4']
    },
    'firs-tropical': { 
      name: 'FIRS Hot Country', 
      difficulty: 'easy',
      description: 'Tropische Wirtschaft mit Plantagen',
      grfs: ['FIRS Industry Replacement Set 4']
    },
    'firs-extreme': { 
      name: 'FIRS Extreme', 
      difficulty: 'hard',
      description: 'Alle Industrien, maximale Komplexität',
      grfs: ['FIRS Industry Replacement Set 4']
    },
    'ecs-full': { 
      name: 'ECS Complete', 
      difficulty: 'medium',
      description: 'Alle ECS Vektoren kombiniert',
      grfs: ['ECS Basic Vector', 'ECS Town Vector', 'ECS Agricultural Vector', 
             'ECS Wood Vector', 'ECS Chemical Vector', 'ECS Machinery Vector']
    },
    'ecs-basic': { 
      name: 'ECS Basic', 
      difficulty: 'easy',
      description: 'Nur Basis- und Stadt-Vektoren',
      grfs: ['ECS Basic Vector', 'ECS Town Vector']
    },
    'yeti': { 
      name: 'YETI Extended', 
      difficulty: 'hard',
      description: 'Abstraktes Logistik-System',
      grfs: ['YETI Extended Towns & Industries']
    },
    'opengfx': { 
      name: 'OpenGFX+ Industries', 
      difficulty: 'easy',
      description: 'Verbesserte Standard-Industrien',
      grfs: ['OpenGFX+ Industries']
    }
  };

  // Fahrzeug-Sets
  const vehicles = {
    trains: {
      'iron-horse': { name: 'Iron Horse 3', style: 'international', era: 'all' },
      '2cc-trains': { name: '2cc TrainSet', style: 'international', era: 'all' },
      'jrs': { name: 'Japanese Railway Set', style: 'asian', era: 'modern' },
      'korean-train': { name: 'Korean Train Set', style: 'asian', era: 'modern' },
      'chinese-train': { name: 'Chinese Train Set', style: 'asian', era: 'modern' },
      'ukrs': { name: 'UK Railway Set', style: 'european', era: 'all' },
      'dbset': { name: 'DBSet XL', style: 'european', era: 'all' },
      'nars': { name: 'North American Renewal Set', style: 'american', era: 'all' },
      'nuts': { name: 'NUTS Unrealistic Train Set', style: 'futuristic', era: 'future' },
      'metro': { name: 'Metro Track Set', style: 'urban', era: 'modern' }
    },
    road: {
      'egrvts': { name: 'eGRVTS', style: 'international', era: 'all' },
      'asian-road': { name: 'Asian Road Set', style: 'asian', era: 'modern' },
      'heqs': { name: 'HEQS Heavy Equipment', style: 'industrial', era: 'all' },
      'dutch-road': { name: 'Dutch Road Furniture', style: 'european', era: 'modern' }
    },
    ships: {
      'fish2': { name: 'FISH 2', style: 'realistic', era: 'all' },
      'squid': { name: 'SQUID Ate FISH', style: 'modern', era: 'modern' }
    },
    aircraft: {
      'av8': { name: 'av8 Aviators Aircraft', style: 'realistic', era: 'all' },
      'planeset': { name: 'World Airliners Set', style: 'realistic', era: 'modern' }
    }
  };

  // Stations
  const stations = {
    'isr': { name: 'Industrial Stations Renewal', style: 'industrial' },
    'dutch-stations': { name: 'Dutch Stations', style: 'european' },
    'chips': { name: 'CHIPS Station Set', style: 'modern' },
    'newstations': { name: 'NewStations', style: 'varied' },
    'japanese-stations': { name: 'Japanese Stations', style: 'asian' },
    'subway': { name: 'Metro Stations', style: 'urban' }
  };

  // Basis-NewGRFs (immer dabei)
  const baseNewGRFs = [
    { name: 'Total Bridge Renewal Set', category: 'infrastructure', order: 1 },
    { name: 'NuTracks', category: 'infrastructure', order: 2 },
    { name: 'OpenGFX+ Landscape', category: 'landscape', order: 3 }
  ];

  // Generiere Ladereihenfolge
  useEffect(() => {
    generateLoadOrder();
  }, [selectedCountry, selectedIndustry, selectedVehicles, selectedStations, customNewGRFs]);

  const generateLoadOrder = () => {
    let order = [];
    let orderNum = 1;

    // 1. Basis-Infrastructure
    baseNewGRFs.forEach(grf => {
      order.push({ ...grf, order: orderNum++ });
    });

    // 2. Klima-spezifisch
    const climate = countries[selectedCountry].climate;
    if (climate === 'tropical' || climate === 'subtropical') {
      order.push({ name: 'Tropical Refurbishment Set', category: 'landscape', order: orderNum++ });
    }

    // 3. Industrien
    const industryData = industries[selectedIndustry];
    industryData.grfs.forEach(grf => {
      order.push({ name: grf, category: 'industry', order: orderNum++, config: industryData.name });
    });

    // 4. Züge
    const trainGRFs = selectedVehicles.filter(v => v.startsWith('trains-'));
    trainGRFs.forEach(v => {
      const key = v.replace('trains-', '');
      order.push({ name: vehicles.trains[key].name, category: 'trains', order: orderNum++ });
    });

    // 5. Straßenfahrzeuge
    const roadGRFs = selectedVehicles.filter(v => v.startsWith('road-'));
    roadGRFs.forEach(v => {
      const key = v.replace('road-', '');
      order.push({ name: vehicles.road[key].name, category: 'road', order: orderNum++ });
    });

    // 6. Schiffe
    const shipGRFs = selectedVehicles.filter(v => v.startsWith('ships-'));
    shipGRFs.forEach(v => {
      const key = v.replace('ships-', '');
      order.push({ name: vehicles.ships[key].name, category: 'ships', order: orderNum++ });
    });

    // 7. Flugzeuge
    const aircraftGRFs = selectedVehicles.filter(v => v.startsWith('aircraft-'));
    aircraftGRFs.forEach(v => {
      const key = v.replace('aircraft-', '');
      order.push({ name: vehicles.aircraft[key].name, category: 'aircraft', order: orderNum++ });
    });

    // 8. Stationen
    selectedStations.forEach(s => {
      order.push({ name: stations[s].name, category: 'stations', order: orderNum++ });
    });

    // 9. Custom NewGRFs
    customNewGRFs.forEach(grf => {
      order.push({ ...grf, order: orderNum++ });
    });

    // 10. Kosmetik (am Ende)
    order.push({ name: 'OpenGFX+ Airports', category: 'cosmetic', order: orderNum++ });
    order.push({ name: 'OpenGFX+ Objects', category: 'cosmetic', order: orderNum++ });

    setLoadOrder(order);
  };

  const toggleVehicle = (vehicleId) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(v => v !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const toggleStation = (stationId) => {
    setSelectedStations(prev => 
      prev.includes(stationId) 
        ? prev.filter(s => s !== stationId)
        : [...prev, stationId]
    );
  };

  const addCustomNewGRF = () => {
    if (customName.trim()) {
      setCustomNewGRFs(prev => [...prev, {
        name: customName,
        category: customCategory,
        custom: true
      }]);
      setCustomName('');
      setShowCustomForm(false);
    }
  };

  const removeCustomNewGRF = (index) => {
    setCustomNewGRFs(prev => prev.filter((_, i) => i !== index));
  };

  const saveConfiguration = () => {
    const config = {
      name: currentSaveName || `Config ${new Date().toLocaleString()}`,
      country: selectedCountry,
      industry: selectedIndustry,
      difficulty: selectedDifficulty,
      vehicles: selectedVehicles,
      stations: selectedStations,
      custom: customNewGRFs,
      timestamp: Date.now()
    };

    const saved = JSON.parse(localStorage.getItem('openttd_configs') || '[]');
    saved.push(config);
    localStorage.setItem('openttd_configs', JSON.stringify(saved));
    setSaveSlots(saved);
    setCurrentSaveName('');
    alert('Konfiguration gespeichert!');
  };

  const loadConfiguration = (config) => {
    setSelectedCountry(config.country);
    setSelectedIndustry(config.industry);
    setSelectedDifficulty(config.difficulty);
    setSelectedVehicles(config.vehicles);
    setSelectedStations(config.stations);
    setCustomNewGRFs(config.custom);
  };

  const exportToText = () => {
    let text = `# OpenTTD NewGRF Ladereihenfolge\n`;
    text += `# Land: ${countries[selectedCountry].name}\n`;
    text += `# Industrie: ${industries[selectedIndustry].name}\n`;
    text += `# Schwierigkeit: ${selectedDifficulty}\n`;
    text += `# Erstellt: ${new Date().toLocaleString()}\n\n`;
    
    loadOrder.forEach((grf, i) => {
      text += `${i + 1}. ${grf.name}`;
      if (grf.config) text += ` (${grf.config})`;
      text += `\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openttd_newgrf_list.txt';
    a.click();
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('openttd_configs') || '[]');
    setSaveSlots(saved);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            OpenTTD NewGRF Builder
          </h1>
          <p className="text-blue-200">Erstelle deine perfekte NewGRF-Ladereihenfolge</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Länder-Auswahl */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🌍 Länder-Set
            </h2>
            <div className="space-y-2">
              {Object.entries(countries).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCountry(key)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedCountry === key
                      ? 'bg-blue-500 shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{data.name}</div>
                  <div className="text-sm text-blue-200">Klima: {data.climate}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Industrie-Auswahl */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🏭 Industrie-Set
            </h2>
            
            {/* Schwierigkeitsfilter */}
            <div className="mb-4 flex gap-2">
              {['easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-green-500'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {diff === 'easy' ? '😊 Einfach' : diff === 'medium' ? '🎯 Mittel' : '🔥 Schwer'}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(industries)
                .filter(([_, data]) => selectedDifficulty === 'all' || data.difficulty === selectedDifficulty || selectedDifficulty === 'medium')
                .map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setSelectedIndustry(key)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedIndustry === key
                      ? 'bg-orange-500 shadow-lg scale-105'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{data.name}</div>
                  <div className="text-xs text-blue-200">{data.description}</div>
                  <div className="text-xs text-yellow-300 mt-1">
                    Schwierigkeit: {data.difficulty}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fahrzeuge */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold mb-4">🚂 Fahrzeuge</h2>
          
          {/* Züge */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Züge</h3>
            <div className="grid md:grid-cols-3 gap-2">
              {Object.entries(vehicles.trains).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => toggleVehicle(`trains-${key}`)}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    selectedVehicles.includes(`trains-${key}`)
                      ? 'bg-green-500'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {data.name}
                  <div className="text-xs opacity-70">{data.style}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Straße */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Straßenfahrzeuge</h3>
            <div className="grid md:grid-cols-3 gap-2">
              {Object.entries(vehicles.road).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => toggleVehicle(`road-${key}`)}
                  className={`p-2 rounded-lg text-sm transition-all ${
                    selectedVehicles.includes(`road-${key}`)
                      ? 'bg-green-500'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          {/* Schiffe & Flugzeuge */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Schiffe</h3>
              <div className="space-y-2">
                {Object.entries(vehicles.ships).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => toggleVehicle(`ships-${key}`)}
                    className={`w-full p-2 rounded-lg text-sm transition-all ${
                      selectedVehicles.includes(`ships-${key}`)
                        ? 'bg-green-500'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {data.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Flugzeuge</h3>
              <div className="space-y-2">
                {Object.entries(vehicles.aircraft).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => toggleVehicle(`aircraft-${key}`)}
                    className={`w-full p-2 rounded-lg text-sm transition-all ${
                      selectedVehicles.includes(`aircraft-${key}`)
                        ? 'bg-green-500'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {data.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stationen */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold mb-4">🏢 Bahnhöfe & Stationen</h2>
          <div className="grid md:grid-cols-3 gap-2">
            {Object.entries(stations).map(([key, data]) => (
              <button
                key={key}
                onClick={() => toggleStation(key)}
                className={`p-3 rounded-lg transition-all ${
                  selectedStations.includes(key)
                    ? 'bg-purple-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold">{data.name}</div>
                <div className="text-xs opacity-70">{data.style}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom NewGRFs */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
            <span>➕ Eigene NewGRFs</span>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Hinzufügen
            </button>
          </h2>

          {showCustomForm && (
            <div className="mb-4 p-4 bg-white/5 rounded-lg">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="NewGRF Name"
                className="w-full p-2 rounded bg-white/10 border border-white/20 mb-2"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full p-2 rounded bg-white/10 border border-white/20 mb-2"
              >
                <option value="infrastructure">Infrastruktur</option>
                <option value="trains">Züge</option>
                <option value="road">Straße</option>
                <option value="ships">Schiffe</option>
                <option value="aircraft">Flugzeuge</option>
                <option value="stations">Stationen</option>
                <option value="industry">Industrie</option>
                <option value="cosmetic">Kosmetik</option>
                <option value="other">Sonstiges</option>
              </select>
              <button
                onClick={addCustomNewGRF}
                className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
              >
                Hinzufügen
              </button>
            </div>
          )}

          <div className="space-y-2">
            {customNewGRFs.map((grf, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                <div>
                  <div className="font-semibold">{grf.name}</div>
                  <div className="text-xs opacity-70">{grf.category}</div>
                </div>
                <button
                  onClick={() => removeCustomNewGRF(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ladereihenfolge */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold mb-4">📋 Ladereihenfolge ({loadOrder.length} NewGRFs)</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {loadOrder.map((grf, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/5 p-2 rounded hover:bg-white/10 transition-all"
              >
                <div className="text-blue-300 font-mono text-sm w-8">{grf.order}.</div>
                <div className="flex-1">
                  <div className="font-semibold">{grf.name}</div>
                  {grf.config && (
                    <div className="text-xs text-yellow-300">Config: {grf.config}</div>
                  )}
                </div>
                <div className="text-xs bg-blue-500/30 px-2 py-1 rounded">
                  {grf.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktionen */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <h3 className="font-bold mb-2">💾 Speichern</h3>
            <input
              type="text"
              value={currentSaveName}
              onChange={(e) => setCurrentSaveName(e.target.value)}
              placeholder="Konfigurations-Name"
              className="w-full p-2 rounded bg-white/10 border border-white/20 mb-2 text-sm"
            />
            <button
              onClick={saveConfiguration}
              className="w-full bg-green-500 hover:bg-green-600 p-2 rounded flex items-center justify-center gap-2"
            >
              <Save size={16} /> Speichern
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <h3 className="font-bold mb-2">📥 Laden</h3>
            <select
              onChange={(e) => {
                const config = saveSlots[e.target.value];
                if (config) loadConfiguration(config);
              }}
              className="w-full p-2 rounded bg-white/10 border border-white/20 mb-2 text-sm"
            >
              <option value="">Konfiguration wählen...</option>
              {saveSlots.map((slot, i) => (
                <option key={i} value={i}>{slot.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <h3 className="font-bold mb-2">📄 Export</h3>
            <button
              onClick={exportToText}
              className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded flex items-center justify-center gap-2"
            >
              <Download size={16} /> Als .txt exportieren
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-blue-200 text-sm">
          <p>💡 Tipp: Konfigurationen werden lokal im Browser gespeichert</p>
          <p className="mt-2">🚀 Für Cloud-Sync: Firebase-Integration geplant</p>
        </div>
      </div>
    </div>
  );
};

export default OpenTTDNewGRFBuilder;
