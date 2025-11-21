import { storage, Plant } from '../utils/storage';

interface WateringHistoryProps {
  plants: Plant[];
}

function WateringHistory({ plants }: WateringHistoryProps) {
  const logs = storage
    .getLogs()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getPlantName = (id: string) => {
    const plant = plants.find((p) => p.id === id);
    return plant ? plant.name : 'Plante inconnue';
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (logs.length === 0) {
    return (
      <div className="card">
        <h2 className="mb-4">Historique</h2>
        <p className="text-slate-500">Aucun historique d'arrosage pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="mb-4">Historique d'arrosage</h2>
      <ul className="list-none">
        {logs.map((log) => (
          <li
            key={log.id}
            className="py-3 border-b border-slate-100 flex justify-between items-center last:border-0"
          >
            <span className="font-medium">{getPlantName(log.plantId)}</span>
            <span className="text-slate-500 text-sm">{formatDate(log.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WateringHistory;
