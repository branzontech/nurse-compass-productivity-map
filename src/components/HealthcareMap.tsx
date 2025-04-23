
import React, { useState } from 'react';
import { User, Users, Hospital, MapPin, ClipboardList, ChartBar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Tipos de datos para profesionales de salud
interface HealthcareProfessional {
  id: number;
  name: string;
  role: 'doctor' | 'nurse';
  appointments: number;
  evolutions: number;
  position: { x: number; y: number };
}

// Datos de ejemplo
const sampleData: HealthcareProfessional[] = [
  { id: 1, name: 'Dr. García', role: 'doctor', appointments: 15, evolutions: 12, position: { x: 20, y: 30 } },
  { id: 2, name: 'Dr. Martínez', role: 'doctor', appointments: 18, evolutions: 14, position: { x: 40, y: 20 } },
  { id: 3, name: 'Dr. Rodríguez', role: 'doctor', appointments: 12, evolutions: 8, position: { x: 65, y: 40 } },
  { id: 4, name: 'Enf. López', role: 'nurse', appointments: 22, evolutions: 18, position: { x: 25, y: 50 } },
  { id: 5, name: 'Enf. Sánchez', role: 'nurse', appointments: 20, evolutions: 15, position: { x: 50, y: 60 } },
  { id: 6, name: 'Enf. Gutiérrez', role: 'nurse', appointments: 18, evolutions: 12, position: { x: 70, y: 25 } },
  { id: 7, name: 'Dr. Hernández', role: 'doctor', appointments: 14, evolutions: 10, position: { x: 35, y: 70 } },
  { id: 8, name: 'Enf. Díaz', role: 'nurse', appointments: 25, evolutions: 20, position: { x: 60, y: 75 } },
];

// Componente para el marcador
const Marker: React.FC<{
  professional: HealthcareProfessional;
  selected: boolean;
  onClick: () => void;
}> = ({ professional, selected, onClick }) => {
  const roleColor = professional.role === 'doctor' ? 'bg-blue-500' : 'bg-green-500';
  const sizeClass = selected ? 'scale-125 z-20' : '';
  
  return (
    <div
      className={`absolute cursor-pointer transition-transform ${sizeClass}`}
      style={{
        left: `${professional.position.x}%`,
        top: `${professional.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
    >
      <div className={`${roleColor} rounded-full p-2 shadow-md`}>
        {professional.role === 'doctor' ? 
          <User className="text-white" size={20} /> : 
          <Users className="text-white" size={20} />
        }
      </div>
      {selected && (
        <div className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
      )}
    </div>
  );
};

// Componente para el popup de información
const InfoPopup: React.FC<{
  professional: HealthcareProfessional;
  onClose: () => void;
}> = ({ professional, onClose }) => {
  const roleColor = professional.role === 'doctor' ? 'border-blue-500' : 'border-green-500';
  const roleText = professional.role === 'doctor' ? 'Médico' : 'Enfermero';
  
  return (
    <div className={`absolute z-30 bg-white rounded-lg shadow-xl p-4 w-64 border-l-4 ${roleColor}`}
      style={{
        left: `${professional.position.x}%`,
        top: `${professional.position.y + 5}%`,
        transform: 'translateX(-50%)',
      }}
    >
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
      <div className="font-bold text-lg">{professional.name}</div>
      <div className="text-sm text-gray-600 mb-2">{roleText}</div>
      
      <div className="flex items-center mt-2">
        <ClipboardList size={16} className="text-gray-500 mr-2" />
        <div className="text-sm">
          <span className="font-semibold">{professional.appointments}</span> Citas asignadas
        </div>
      </div>
      
      <div className="flex items-center mt-1">
        <ChartBar size={16} className="text-gray-500 mr-2" />
        <div className="text-sm">
          <span className="font-semibold">{professional.evolutions}</span> Evoluciones
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">Productividad</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div 
            className={`h-2.5 rounded-full ${professional.role === 'doctor' ? 'bg-blue-500' : 'bg-green-500'}`}
            style={{ width: `${(professional.evolutions / professional.appointments) * 100}%` }}
          ></div>
        </div>
        <div className="text-xs text-right mt-1">
          {Math.round((professional.evolutions / professional.appointments) * 100)}%
        </div>
      </div>
    </div>
  );
};

// Componente principal del mapa
const HealthcareMap: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<HealthcareProfessional | null>(null);
  const [filter, setFilter] = useState<'all' | 'doctor' | 'nurse'>('all');
  const isMobile = useIsMobile();
  
  // Filtrar los datos según el filtro seleccionado
  const filteredData = sampleData.filter(p => 
    filter === 'all' || p.role === filter
  );
  
  // Estadísticas para el panel lateral
  const totalDoctors = sampleData.filter(p => p.role === 'doctor').length;
  const totalNurses = sampleData.filter(p => p.role === 'nurse').length;
  const totalAppointments = sampleData.reduce((sum, p) => sum + p.appointments, 0);
  const totalEvolutions = sampleData.reduce((sum, p) => sum + p.evolutions, 0);
  
  return (
    <div className="flex flex-col md:flex-row h-full gap-4">
      {/* Panel lateral */}
      <div className={`${isMobile ? 'order-2' : 'order-1'} w-full md:w-64 bg-white rounded-lg shadow-md p-4`}>
        <h2 className="text-xl font-bold mb-4">Productividad Médica</h2>
        
        {/* Filtros */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Filtrar por rol</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('doctor')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'doctor' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Médicos
            </button>
            <button
              onClick={() => setFilter('nurse')}
              className={`px-3 py-1 text-sm rounded-full ${
                filter === 'nurse' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              Enfermeros
            </button>
          </div>
        </div>
        
        {/* Estadísticas */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Personal</div>
            <div className="flex justify-between mt-1">
              <div>
                <div className="flex items-center">
                  <User className="text-blue-500 mr-1" size={14} />
                  <span className="text-sm">Médicos</span>
                </div>
                <div className="font-bold">{totalDoctors}</div>
              </div>
              <div>
                <div className="flex items-center">
                  <Users className="text-green-500 mr-1" size={14} />
                  <span className="text-sm">Enfermeros</span>
                </div>
                <div className="font-bold">{totalNurses}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Productividad Total</div>
            <div className="flex justify-between mt-1">
              <div>
                <div className="flex items-center">
                  <ClipboardList className="text-gray-700 mr-1" size={14} />
                  <span className="text-sm">Citas</span>
                </div>
                <div className="font-bold">{totalAppointments}</div>
              </div>
              <div>
                <div className="flex items-center">
                  <ChartBar className="text-gray-700 mr-1" size={14} />
                  <span className="text-sm">Evoluciones</span>
                </div>
                <div className="font-bold">{totalEvolutions}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-gray-500">Promedio de completitud</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="h-2.5 rounded-full bg-purple-500"
                  style={{ width: `${(totalEvolutions / totalAppointments) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-right mt-1">
                {Math.round((totalEvolutions / totalAppointments) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mapa */}
      <div className={`${isMobile ? 'order-1' : 'order-2'} flex-grow relative bg-slate-100 rounded-lg shadow-md overflow-hidden`} style={{ minHeight: '500px' }}>
        {/* Fondo del mapa */}
        <div className="absolute inset-0 bg-slate-100">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(to right, #f0f0f080 1px, transparent 1px), linear-gradient(to bottom, #f0f0f080 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Hospital size={200} />
          </div>
        </div>
        
        {/* Marcadores */}
        <div className="absolute inset-0">
          {filteredData.map((professional) => (
            <Marker
              key={professional.id}
              professional={professional}
              selected={selectedProfessional?.id === professional.id}
              onClick={() => setSelectedProfessional(professional)}
            />
          ))}
        </div>
        
        {/* Popup de información */}
        {selectedProfessional && (
          <InfoPopup
            professional={selectedProfessional}
            onClose={() => setSelectedProfessional(null)}
          />
        )}
        
        {/* Leyenda */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-md shadow-md">
          <div className="text-sm font-semibold mb-2">Leyenda</div>
          <div className="flex items-center mb-2">
            <div className="bg-blue-500 rounded-full p-1 mr-2">
              <User className="text-white" size={14} />
            </div>
            <span className="text-sm">Médico</span>
          </div>
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-2">
              <Users className="text-white" size={14} />
            </div>
            <span className="text-sm">Enfermero</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareMap;
