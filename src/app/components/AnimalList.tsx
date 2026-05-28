import { AlertTriangle, MapPin, ChevronRight } from 'lucide-react';
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

interface AnimalListProps {
  animals: Animal[];
  onAnimalSelect: (animal: Animal) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const statusConfig = {
  critical: {
    label: 'Crítico',
    color: 'bg-red-500',
    dotColor: 'bg-red-400',
  },
  endangered: {
    label: 'En Peligro',
    color: 'bg-amber-500',
    dotColor: 'bg-amber-400',
  },
  vulnerable: {
    label: 'Vulnerable',
    color: 'bg-emerald-500',
    dotColor: 'bg-emerald-400',
  },
};

export function AnimalList({ animals, onAnimalSelect, isOpen, onToggle }: AnimalListProps) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? '60vh' : '80px' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-30 overflow-hidden"
    >
      {/* Handle */}
      <button
        onClick={onToggle}
        className="w-full py-4 flex flex-col items-center gap-2 border-b"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {animals.length} Animales Reportados
          </span>
          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-90' : '-rotate-90'
            }`}
          />
        </div>
      </button>

      {/* List */}
      <div className="overflow-y-auto h-[calc(60vh-80px)] px-4 py-2">
        <div className="space-y-3 pb-4">
          {animals.map((animal, index) => {
            const config = statusConfig[animal.status];
            return (
              <motion.button
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAnimalSelect(animal)}
                className="w-full bg-white border border-gray-200 rounded-2xl p-3 hover:shadow-lg transition-shadow flex items-center gap-3"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={animal.image}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 ${config.dotColor} w-3 h-3 rounded-full border-2 border-white`} />
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{animal.name}</h3>
                  <p className="text-sm text-gray-500">{animal.species}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`${config.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-400">{animal.reportedDate}</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
