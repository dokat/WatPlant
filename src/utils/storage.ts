export interface Plant {
  id: string;
  name: string;
  species?: string;
  waterIntervalDays: number;
  lastWatered: string;
  image?: string;
  createdAt: string;
}

export interface Log {
  id: string;
  plantId: string;
  date: string;
}

interface StorageData {
  plants: Plant[];
  logs: Log[];
}

const STORAGE_KEY = 'watplant_data';

const getInitialData = (): StorageData => ({
  plants: [],
  logs: [],
});

export const storage = {
  getData: (): StorageData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : getInitialData();
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return getInitialData();
    }
  },

  saveData: (data: StorageData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  addPlant: (plant: Omit<Plant, 'id' | 'lastWatered' | 'createdAt'>): Plant => {
    const data = storage.getData();
    const now = new Date().toISOString();
    const newPlant: Plant = {
      ...plant,
      id: crypto.randomUUID(),
      lastWatered: now,
      createdAt: now,
    };
    data.plants.push(newPlant);
    storage.saveData(data);
    return newPlant;
  },

  getPlants: (): Plant[] => {
    return storage.getData().plants;
  },

  deletePlant: (id: string) => {
    const data = storage.getData();
    data.plants = data.plants.filter((p) => p.id !== id);
    data.logs = data.logs.filter((l) => l.plantId !== id);
    storage.saveData(data);
  },

  updatePlant: (updatedPlant: Plant) => {
    const data = storage.getData();
    const index = data.plants.findIndex((p) => p.id === updatedPlant.id);
    if (index !== -1) {
      data.plants[index] = updatedPlant;
      storage.saveData(data);
    }
  },

  waterPlant: (plantId: string) => {
    const data = storage.getData();
    const plantIndex = data.plants.findIndex((p) => p.id === plantId);
    if (plantIndex === -1) return;

    const now = new Date().toISOString();

    // Update plant
    data.plants[plantIndex].lastWatered = now;

    // Add log
    data.logs.push({
      id: crypto.randomUUID(),
      plantId,
      date: now,
    });

    storage.saveData(data);
  },

  getLogs: (plantId?: string): Log[] => {
    const data = storage.getData();
    if (plantId) {
      return data.logs.filter((l) => l.plantId === plantId);
    }
    return data.logs;
  },
};
