import { useRef, useState, useEffect } from 'react';

interface CameraCaptureProps {
  // eslint-disable-next-line no-unused-vars
  onCapture: (data: string) => void;
  onClose: () => void;
}

function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {

    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        // Resize logic could be here or handled by the parent via resizeImage utility
        // For now, let's just pass the raw base64 and let the parent handle resizing if needed
        // or we can use toDataURL quality parameter
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
        stopCamera();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col">
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-4">
            <p className="mb-4">{error}</p>
            <button onClick={onClose} className="btn bg-white text-black">
              Fermer
            </button>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
      </div>

      <div className="bg-black p-6 flex justify-between items-center safe-area-bottom">
        <button onClick={onClose} className="text-white p-4">
          Annuler
        </button>
        {!error && (
          <button
            onClick={takePhoto}
            className="w-16 h-16 rounded-full border-4 border-white bg-white/20 flex items-center justify-center"
            aria-label="Prendre une photo"
          >
            <div className="w-12 h-12 rounded-full bg-white"></div>
          </button>
        )}
        <div className="w-16"></div> {/* Spacer for centering */}
      </div>
    </div>
  );
}

export default CameraCapture;
