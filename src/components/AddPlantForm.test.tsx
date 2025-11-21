import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddPlantForm from './AddPlantForm';
import { storage } from '../utils/storage';

// Mock storage
vi.mock('../utils/storage', () => ({
    storage: {
        addPlant: vi.fn(),
    },
}));

// Mock image utility
vi.mock('../utils/image', () => ({
    resizeImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,resized'),
}));

describe('AddPlantForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the add button initially', () => {
        render(<AddPlantForm onPlantAdded={() => { }} />);
        expect(screen.getByText(/\+ Ajouter une plante/i)).toBeInTheDocument();
    });

    it('should open the form when add button is clicked', async () => {
        render(<AddPlantForm onPlantAdded={() => { }} />);
        const user = userEvent.setup();

        await user.click(screen.getByText(/\+ Ajouter une plante/i));

        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText(/Espèce/i)).toBeInTheDocument();
    });

    it('should submit the form with valid data', async () => {
        const onPlantAdded = vi.fn();
        render(<AddPlantForm onPlantAdded={onPlantAdded} />);
        const user = userEvent.setup();

        // Open form
        await user.click(screen.getByText(/\+ Ajouter une plante/i));

        // Fill form
        await user.type(screen.getByLabelText('Nom'), 'Monstera');
        await user.type(screen.getByLabelText(/Espèce/i), 'Deliciosa');

        // Submit
        await user.click(screen.getByText('Enregistrer'));

        expect(storage.addPlant).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Monstera',
            species: 'Deliciosa',
            waterIntervalDays: 7, // Default
        }));

        expect(onPlantAdded).toHaveBeenCalled();
    });

    it('should not submit if name is empty', async () => {
        const onPlantAdded = vi.fn();
        render(<AddPlantForm onPlantAdded={onPlantAdded} />);
        const user = userEvent.setup();

        await user.click(screen.getByText(/\+ Ajouter une plante/i));

        // Submit without name
        // Note: HTML5 validation might prevent click handler, but we check if storage was called
        await user.click(screen.getByText('Enregistrer'));

        expect(storage.addPlant).not.toHaveBeenCalled();
    });
});
