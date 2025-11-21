import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('storage utility', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should initialize with empty data if localStorage is empty', () => {
        const data = storage.getData();
        expect(data).toEqual({ plants: [], logs: [] });
    });

    it('should add a plant correctly', () => {
        const newPlant = {
            name: 'Ficus',
            species: 'Ficus elastica',
            waterIntervalDays: 7,
        };

        const addedPlant = storage.addPlant(newPlant);

        expect(addedPlant.id).toBeDefined();
        expect(addedPlant.name).toBe('Ficus');
        expect(addedPlant.createdAt).toBeDefined();
        expect(addedPlant.lastWatered).toBeDefined();

        const data = storage.getData();
        expect(data.plants).toHaveLength(1);
        expect(data.plants[0]).toEqual(addedPlant);
    });

    it('should update a plant correctly', () => {
        const plant = storage.addPlant({
            name: 'Ficus',
            waterIntervalDays: 7,
        });

        storage.updatePlant({
            ...plant,
            name: 'Grand Ficus',
        });

        const data = storage.getData();
        expect(data.plants[0].name).toBe('Grand Ficus');
    });

    it('should delete a plant correctly', () => {
        const plant = storage.addPlant({
            name: 'Ficus',
            waterIntervalDays: 7,
        });

        storage.deletePlant(plant.id);

        const data = storage.getData();
        expect(data.plants).toHaveLength(0);
    });

    it('should log watering correctly', () => {
        const plant = storage.addPlant({
            name: 'Ficus',
            waterIntervalDays: 7,
        });

        // Manually set lastWatered to the past
        const past = new Date();
        past.setDate(past.getDate() - 1);
        plant.lastWatered = past.toISOString();

        // Update storage with modified plant
        const allData = storage.getData();
        const pIndex = allData.plants.findIndex(p => p.id === plant.id);
        allData.plants[pIndex] = plant;
        storage.saveData(allData);

        storage.waterPlant(plant.id);

        const data = storage.getData();
        const updatedPlant = data.plants[0];

        expect(new Date(updatedPlant.lastWatered).getTime()).toBeGreaterThan(new Date(plant.lastWatered).getTime());
        expect(data.logs).toHaveLength(1);
        expect(data.logs[0].plantId).toBe(plant.id);
    });
});
