import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlantList from './PlantList';
import { Plant } from '../utils/storage';

describe('PlantList', () => {
    const mockPlants: Plant[] = [
        {
            id: '1',
            name: 'Ficus',
            species: 'Elastica',
            waterIntervalDays: 7,
            lastWatered: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            name: 'Pothos',
            waterIntervalDays: 3,
            lastWatered: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        },
    ];

    it('should render empty state when no plants', () => {
        render(<PlantList plants={[]} onUpdate={() => { }} />);
        expect(screen.getByText(/Aucune plante enregistrée/i)).toBeInTheDocument();
    });

    it('should render list of plants', () => {
        render(<PlantList plants={mockPlants} onUpdate={() => { }} />);
        expect(screen.getByText('Ficus')).toBeInTheDocument();
        expect(screen.getByText('Pothos')).toBeInTheDocument();
        expect(screen.getByText('Elastica')).toBeInTheDocument();
    });
});
