import { X, MapPin, Calendar, User, AlertTriangle } from 'lucide-react';
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

interface AnimalDetailsProps {
  animal: Animal | null;
  onClose: () => void;
}

const statusConfig = {
  critical: {
    label: 'Estado Crítico',
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  endangered: {
    label: 'En Peligro',
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  vulnerable: {
    label: 'Vulnerable',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
};

export function AnimalDetails({ animal, onClose }: AnimalDetailsProps) {
  if (!animal) return null;

  const config = statusConfig[animal.status];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
      >
        {/* Image Header */}
        <div className="relative h-56 bg-gray-200">
          <img
            src={animal.image}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Status Badge */}
          <div className={`absolute top-4 left-4 ${config.color} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2`}>
            <AlertTriangle className="w-4 h-4" />
            {config.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-14rem)]">
          <h2 className="text-2xl font-bold mb-1">{animal.name}</h2>
          <p className="text-gray-600 mb-4">{animal.species}</p>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700">{animal.description}</p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${config.bgColor} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <User className={`w-4 h-4 ${config.textColor}`} />
                  <span className={`text-sm ${config.textColor} font-medium`}>
                    Reportado por
                  </span>
                </div>
                <p className="text-gray-900 font-semibold">{animal.reportedBy}</p>
              </div>

              <div className={`${config.bgColor} rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className={`w-4 h-4 ${config.textColor}`} />
                  <span className={`text-sm ${config.textColor} font-medium`}>
                    Fecha
                  </span>
                </div>
                <p className="text-gray-900 font-semibold">{animal.reportedDate}</p>
              </div>
            </div>

            {/* Location */}
            <div className={`${config.bgColor} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className={`w-4 h-4 ${config.textColor}`} />
                <span className={`text-sm ${config.textColor} font-medium`}>
                  Ubicación
                </span>
              </div>
              <p className="text-gray-900 font-semibold">
                {animal.location[0].toFixed(4)}, {animal.location[1].toFixed(4)}
              </p>
            </div>

            {/* Action Button */}
            <button className={`w-full ${config.color} text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity`}>
              Ver en el Mapa
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
