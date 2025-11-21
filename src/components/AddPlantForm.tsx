import { useState, FormEvent, ChangeEvent } from 'react';
import { storage } from '../utils/storage';
import { resizeImage } from '../utils/image';
import CameraCapture from './CameraCapture';

interface AddPlantFormProps {
  onPlantAdded: () => void;
}

function AddPlantForm({ onPlantAdded }: AddPlantFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [waterInterval, setWaterInterval] = useState(7);
  const [image, setImage] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name) return;

    storage.addPlant({
      name,
      species,
      waterIntervalDays:
        typeof waterInterval === 'string' ? parseInt(waterInterval, 10) : waterInterval,
      image,
    });

    setName('');
    setSpecies('');
    setWaterInterval(7);
    setImage('');
    setIsOpen(false);
    onPlantAdded();
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

  if (!isOpen) {
    return (
      <button className="btn btn-primary w-full mb-4" onClick={() => setIsOpen(true)}>
        + Ajouter une plante
      </button>
    );
  }

  return (
    <div className="card mb-8">
      <h2 className="mb-4">Nouvelle Plante</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium">Nom</label>
          <input
            id="name"
            type="text"
            className="input"
            placeholder="Ex: Mon Ficus"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="species" className="block mb-2 font-medium">Espèce (optionnel)</label>
          <input
            id="species"
            type="text"
            className="input"
            placeholder="Ex: Ficus Elastica"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block mb-2 font-medium">Photo</label>
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
            id="image"
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
            <div className="mt-2">
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
          <label htmlFor="waterInterval" className="block mb-2 font-medium">Fréquence d'arrosage (jours)</label>
          <input
            id="waterInterval"
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
            Enregistrer
          </button>
          <button
            type="button"
            className="btn bg-slate-200 text-slate-800 hover:bg-slate-300"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPlantForm;
