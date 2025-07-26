
import { AddStampForm } from "@/components/forms/AddStampForm";

export default function AddStampPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add a New Stamp</h1>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <AddStampForm />
      </div>
    </div>
  );
}
