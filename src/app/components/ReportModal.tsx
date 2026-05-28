import { useState } from 'react';
import { X, Camera, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: NewAnimalReport) => void;
  userLocation?: [number, number];
}

export interface NewAnimalReport {
  name: string;
  species: string;
  status: 'critical' | 'endangered' | 'vulnerable';
  description: string;
  location: [number, number];
}

export function ReportModal({ isOpen, onClose, onSubmit, userLocation }: ReportModalProps) {
  const [formData, setFormData] = useState<NewAnimalReport>({
    name: '',
    species: '',
    status: 'vulnerable',
    description: '',
    location: userLocation || [19.4326, -99.1332],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      name: '',
      species: '',
      status: 'vulnerable',
      description: '',
      location: userLocation || [19.4326, -99.1332],
    });
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-3xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Reportar Animal</h2>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-emerald-50">
            Ayuda a proteger la vida silvestre reportando avistamientos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Photo Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
            <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600">Toca para agregar una foto</p>
            <p className="text-xs text-gray-400 mt-1">Opcional</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del animal
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Ej: Jaguar adulto"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Especie
            </label>
            <input
              type="text"
              required
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Ej: Panthera onca"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado de conservación
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'vulnerable' })}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  formData.status === 'vulnerable'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                Vulnerable
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'endangered' })}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  formData.status === 'endangered'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
              >
                En Peligro
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'critical' })}
                className={`py-3 rounded-xl font-semibold transition-all ${
                  formData.status === 'critical'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                Crítico
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
              placeholder="Describe el avistamiento, comportamiento, condición, etc."
            />
          </div>

          {/* Location Info */}
          <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Ubicación detectada</p>
              <p className="text-xs text-blue-700 mt-1">
                {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-900">
              Asegúrate de mantener una distancia segura al observar animales en peligro
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
          >
            Enviar Reporte
          </button>
        </form>
      </motion.div>
    </>
  );
}
