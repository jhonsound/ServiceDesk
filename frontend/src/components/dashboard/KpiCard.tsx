// Un sub-componente para cada tarjeta del KPI, para mantener el código limpio
function KpiCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="bg-[#242424] p-6 rounded-lg shadow-2xl">
      <h3 className="text-sm font-medium text-gray-100">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

export default KpiCard;