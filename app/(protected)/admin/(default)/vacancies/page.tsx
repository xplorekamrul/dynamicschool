import VacancyTable from "@/app/(protected)/admin/(default)/vacancies/vacancy-table";

export default function VacanciesPage() {
   return (
      <div className="space-y-6 ">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Vacancies Management</h1>
            <p className="text-gray-500 mt-1">
               Manage job vacancies for your institute
            </p>
         </div>

         <VacancyTable />
      </div>
   );
}
