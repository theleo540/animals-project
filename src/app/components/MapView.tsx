import { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface Animal {
  id: string;
  name: string;
  species: string;
  status: 'critical' | 'endangered' | 'vulnerable';
  location: [number, number];
  image: string;
  reportedBy: string;
  reportedDate: string;
  description: string;
}

interface MapViewProps {
  animals: Animal[];
  center: [number, number];
  onAnimalClick: (animal: Animal) => void;
  userLocation?: [number, number];
}

const statusColors = {
  critical: '#EF4444',
  endangered: '#F59E0B',
  vulnerable: '#10B981',
};

// Convert lat/lng to pixel coordinates for display
function coordsToPixels(coords: [number, number], center: [number, number]) {
  const scale = 10000; // Adjust this for zoom level
  const x = 50 + (coords[1] - center[1]) * scale;
  const y = 50 - (coords[0] - center[0]) * scale;
  return { x: `${x}%`, y: `${y}%` };
}

export function MapView({ animals, center, onAnimalClick, userLocation }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState(center);
  
  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100">
      {/* Map Pattern Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .1) 25%, rgba(34, 197, 94, .1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .1) 75%, rgba(34, 197, 94, .1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .1) 25%, rgba(34, 197, 94, .1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .1) 75%, rgba(34, 197, 94, .1) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Decorative map features */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-green-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-emerald-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-teal-200/40 rounded-full blur-2xl" />
      </div>

      {/* User Location Marker */}
      {userLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute z-10"
          style={{
            left: coordsToPixels(userLocation, mapCenter).x,
            top: coordsToPixels(userLocation, mapCenter).y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="relative">
            {/* Pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-blue-500 rounded-full w-12 h-12 -m-6"
            />
            {/* Center dot */}
            <div className="relative bg-blue-500 rounded-full w-12 h-12 border-4 border-white shadow-lg flex items-center justify-center">
              <Navigation className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Animal Markers */}
      {animals.map((animal, index) => {
        const position = coordsToPixels(animal.location, mapCenter);
        return (
          <motion.button
            key={animal.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnimalClick(animal)}
            className="absolute z-20 cursor-pointer"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Marker */}
            <div className="relative">
              {/* Outer glow */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
                className="absolute inset-0 rounded-full blur-md -m-2"
                style={{ backgroundColor: statusColors[animal.status] }}
              />
              
              {/* Marker circle */}
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                style={{ backgroundColor: statusColors[animal.status] }}
              >
                <MapPin className="w-7 h-7 text-white fill-white" />
              </div>

              {/* Mini image preview */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-md">
                <img 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        Wildlife Rescue Map
      </div>
    </div>
  );
}