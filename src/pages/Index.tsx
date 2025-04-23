
import HealthcareMap from "@/components/HealthcareMap";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Mapa de Productividad: Personal Médico
          </h1>
          <p className="text-gray-600 mt-1">
            Visualización de citas y evoluciones asignadas a médicos y enfermeros
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 min-h-[80vh]">
          <HealthcareMap />
        </div>
      </div>
    </div>
  );
};

export default Index;
