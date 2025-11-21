import { describe, it, expect, vi } from 'vitest';
import { resizeImage } from './image';

describe('resizeImage', () => {
    it('should resize an image', async () => {
        // Mock FileReader using a class
        const MockFileReader = class {
            readAsDataURL = vi.fn();
            onload: any = null;
            result = 'data:image/jpeg;base64,fake-image-data';

            constructor() {
                // Simulate async onload
                setTimeout(() => {
                    if (this.onload) {
                        this.onload({ target: { result: this.result } });
                    }
                }, 10);
            }
        };

        vi.stubGlobal('FileReader', MockFileReader);

        // Mock Image
        const MockImage = class {
            onload: any = null;
            onerror: any = null;
            width = 1000;
            height = 1000;
            src = '';

            constructor() {
                // Simulate async onload
                setTimeout(() => {
                    if (this.onload) {
                        this.onload();
                    }
                }, 20);
            }
        };

        vi.stubGlobal('Image', MockImage);

        // Mock Canvas
        const mockContext = {
            drawImage: vi.fn(),
        };
        const mockCanvas = {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue(mockContext),
            toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,resized-image-data'),
        };

        vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') return mockCanvas as any;
            return document.createElement(tagName);
        });

        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
        const result = await resizeImage(file);

        expect(result).toBe('data:image/jpeg;base64,resized-image-data');
        expect(mockCanvas.width).toBe(500); // Default max width
        expect(mockCanvas.height).toBe(500); // Aspect ratio preserved
        expect(mockContext.drawImage).toHaveBeenCalled();
    });
});
