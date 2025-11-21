/// <reference types="vite/client" />
import { useState } from 'react';
import AddPlantForm from './components/AddPlantForm';
import PlantList from './components/PlantList';
import WateringHistory from './components/WateringHistory';
import { storage, Plant } from './utils/storage';



function App() {
  const [plants, setPlants] = useState<Plant[]>(() => storage.getPlants());

  const refreshPlants = () => {
    setPlants(storage.getPlants());
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center"><img src={`${import.meta.env.VITE_BASE_PATH}logo.png`} alt="WatPlant logo" className="w-8 h-8 mr-2" />WatPlant</h1>
        <p className="text-slate-500">Gardez vos plantes heureuses et hydratées.</p>
      </header>

      <main>
        <AddPlantForm onPlantAdded={refreshPlants} />

        <div className="mt-8">
          <h2 className="mb-4">Mes Plantes</h2>
          <PlantList plants={plants} onUpdate={refreshPlants} />
        </div>

        <div className="mt-8">
          <WateringHistory plants={plants} />
        </div>
      </main>
    </div>
  );
}

export default App;
