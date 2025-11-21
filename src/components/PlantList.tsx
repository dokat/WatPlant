import { useState } from 'react';
import { storage, Plant } from '../utils/storage';
import EditPlantModal from './EditPlantModal';

interface PlantListProps {
  plants: Plant[];
  onUpdate: () => void;
}

function PlantList({ plants, onUpdate }: PlantListProps) {
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const getNextWateringDate = (lastWatered: string, interval: number) => {
    const date = new Date(lastWatered);
    date.setDate(date.getDate() + interval);
    return date;
  };

  const isThirsty = (plant: Plant) => {
    const nextWatering = getNextWateringDate(plant.lastWatered, plant.waterIntervalDays);
    const now = new Date();
    return now >= nextWatering;
  };

  const handleWater = (id: string) => {
    storage.waterPlant(id);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette plante ?')) {
      storage.deletePlant(id);
      onUpdate();
    }
  };

  if (plants.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500">
        <p>Aucune plante enregistrée. Ajoutez votre première plante ! 🌱</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => {
          const thirsty = isThirsty(plant);
          const nextWatering = getNextWateringDate(plant.lastWatered, plant.waterIntervalDays);

          return (
            <div
              key={plant.id}
              className={`card relative ${thirsty ? 'border-l-4 border-l-accent' : 'border-l-4 border-l-primary'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  {plant.image ? (
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      🌿
                    </div>
                  )}
                  <div>
                    <h3 className="mb-1 font-semibold">{plant.name}</h3>
                    {plant.species && <p className="text-slate-500 text-sm">{plant.species}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingPlant(plant)}
                    className="text-slate-400 hover:text-primary text-xl px-2"
                    aria-label="Modifier"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(plant.id)}
                    className="text-slate-400 hover:text-red-500 text-xl px-2"
                    aria-label="Supprimer"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="mb-4 text-sm">
                <p className="mb-1">
                  Arrosage tous les <strong>{plant.waterIntervalDays} jours</strong>
                </p>
                <p className={thirsty ? 'text-accent font-medium' : 'text-slate-500'}>
                  {thirsty
                    ? `⚠️ Aurait dû être arrosé le ${nextWatering.toLocaleDateString()}`
                    : `Prochain arrosage : ${nextWatering.toLocaleDateString()}`}
                </p>
              </div>

              <button
                className={`btn w-full ${thirsty ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleWater(plant.id)}
              >
                💧 Arroser maintenant
              </button>
            </div>
          );
        })}
      </div>

      {editingPlant && (
        <EditPlantModal
          plant={editingPlant}
          onClose={() => setEditingPlant(null)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}

export default PlantList;
