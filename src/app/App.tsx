import { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { AnimalDetails } from './components/AnimalDetails';
import { ReportModal, NewAnimalReport } from './components/ReportModal';
import { AnimalList } from './components/AnimalList';
import { Plus, Menu, Navigation, Filter } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

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

const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Jaguar Adulto',
    species: 'Panthera onca',
    status: 'endangered',
    location: [19.4326, -99.1332],
    image: 'https://images.unsplash.com/photo-1728557349552-c1660fbdff7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmRhbmdlcmVkJTIwamFndWFyJTIwd2lsZGxpZmV8ZW58MXx8fHwxNzcxMjkxNjUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    reportedBy: 'Carlos M.',
    reportedDate: '15 Feb 2026',
    description: 'Jaguar adulto avistado cerca de la reserva. Parece estar en buenas condiciones pero se acercó a zonas habitadas buscando agua.',
  },
  {
    id: '2',
    name: 'Tortuga Marina',
    species: 'Chelonia mydas',
    status: 'vulnerable',
    location: [19.4426, -99.1432],
    image: 'https://images.unsplash.com/photo-1549557143-90d216195a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWElMjB0dXJ0bGUlMjBvY2VhbnxlbnwxfHx8fDE3NzEyMTYxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    reportedBy: 'Ana L.',
    reportedDate: '14 Feb 2026',
    description: 'Tortuga verde encontrada en la playa. Presentaba señales de fatiga. Se le ayudó a regresar al océano de manera segura.',
  },
  {
    id: '3',
    name: 'Panda Rojo',
    species: 'Ailurus fulgens',
    status: 'endangered',
    location: [19.4226, -99.1532],
    image: 'https://images.unsplash.com/photo-1770231384608-09f355f0169a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBwYW5kYSUyMHRyZWV8ZW58MXx8fHwxNzcxMjkxNjUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    reportedBy: 'Miguel R.',
    reportedDate: '13 Feb 2026',
    description: 'Panda rojo juvenil observado en zona de bosque templado. Se alimentaba de bambú. Parece estar saludable.',
  },
  {
    id: '4',
    name: 'Elefante Africano',
    species: 'Loxodonta africana',
    status: 'critical',
    location: [19.4126, -99.1232],
    image: 'https://images.unsplash.com/photo-1754729919659-014cf7f0b922?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVwaGFudCUyMGFmcmljYSUyMHdpbGRsaWZlfGVufDF8fHx8MTc3MTI5MTY1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    reportedBy: 'Sandra P.',
    reportedDate: '12 Feb 2026',
    description: 'Manada de elefantes africanos en movimiento. Presentan signos de desnutrición. Se notificó a autoridades locales de conservación.',
  },
];

function App() {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([19.4326, -99.1332]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied', error);
        }
      );
    }
  }, []);

  const handleReportSubmit = (report: NewAnimalReport) => {
    const newAnimal: Animal = {
      id: Date.now().toString(),
      ...report,
      image: 'https://images.unsplash.com/photo-1728557349552-c1660fbdff7c?w=400',
      reportedBy: 'Usuario',
      reportedDate: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };
    setAnimals([newAnimal, ...animals]);
  };

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsListOpen(false);
  };

  const recenterMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map */}
      <div className="absolute inset-0">
        <MapView
          animals={animals}
          center={userLocation}
          onAnimalClick={handleAnimalClick}
          userLocation={userLocation}
        />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="text-center">
            <h1 className="font-bold text-gray-900">Wildlife Rescue</h1>
            <p className="text-xs text-gray-500">{animals.length} reportes activos</p>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Filter className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-3">
        {/* Recenter Button */}
        <button
          onClick={recenterMap}
          className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Navigation className="w-6 h-6 text-gray-700" />
        </button>

        {/* Report Button */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transform"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Animal List */}
      <AnimalList
        animals={animals}
        onAnimalSelect={handleAnimalClick}
        isOpen={isListOpen}
        onToggle={() => setIsListOpen(!isListOpen)}
      />

      {/* Modals */}
      <AnimatePresence>
        {selectedAnimal && (
          <AnimalDetails
            animal={selectedAnimal}
            onClose={() => setSelectedAnimal(null)}
          />
        )}
      </AnimatePresence>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        userLocation={userLocation}
      />
    </div>
  );
}

export default App;
