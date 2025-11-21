import { useState, FormEvent, ChangeEvent } from 'react';
import { Plant, storage } from '../utils/storage';
import { resizeImage } from '../utils/image';
import CameraCapture from './CameraCapture';

interface EditPlantModalProps {
  plant: Plant;
  onClose: () => void;
  onSave: () => void;
}

function EditPlantModal({ plant, onClose, onSave }: EditPlantModalProps) {
  const [name, setName] = useState(plant.name);
  const [species, setSpecies] = useState(plant.species || '');
  const [waterInterval, setWaterInterval] = useState(plant.waterIntervalDays);
  const [image, setImage] = useState<string>(plant.image || '');
  const [showCamera, setShowCamera] = useState(false);

  // Reset state if plant changes (though usually modal unmounts)


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name) return;

    storage.updatePlant({
      ...plant,
      name,
      species,
      waterIntervalDays:
        typeof waterInterval === 'string' ? parseInt(waterInterval, 10) : waterInterval,
      image,
    });

    onSave();
    onClose();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const resized = await resizeImage(e.target.files[0]);
        setImage(resized);
      } catch (error) {
        console.error('Error resizing image:', error);
        alert("Erreur lors du traitement de l'image");
      }
    }
  };

  const handleCameraCapture = (imageData: string) => {
    setImage(imageData);
    setShowCamera(false);
  };

  if (showCamera) {
    return <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Modifier la plante</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Nom</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Espèce</label>
            <input
              type="text"
              className="input"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Photo</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="btn bg-slate-100 text-slate-700 hover:bg-slate-200 flex-1"
              >
                📷 Prendre une photo
              </button>
            </div>
            <div className="text-center text-sm text-slate-400 mb-2">- OU -</div>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20
              "
              onChange={handleImageChange}
            />
            {image && (
              <div className="mt-2 relative">
                <img
                  src={image}
                  alt="Prévisualisation"
                  className="h-32 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-red-500 text-sm mt-1"
                >
                  Supprimer la photo
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Fréquence d'arrosage (jours)</label>
            <input
              type="number"
              className="input"
              min="1"
              value={waterInterval}
              onChange={(e) => setWaterInterval(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary flex-1">
              Sauvegarder
            </button>
            <button
              type="button"
              className="btn bg-slate-200 text-slate-800 hover:bg-slate-300"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPlantModal;
