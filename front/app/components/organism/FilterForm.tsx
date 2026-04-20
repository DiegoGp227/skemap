"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  search: string;
};

interface IFilterFormProps {
  onFilterStatus: (status: string) => void;
  onFilterSearch: (search: string) => void;
}

export default function FilterForm({
  onFilterStatus,
  onFilterSearch,
}: IFilterFormProps) {
  const { register, watch } = useForm<FormValues>({
    defaultValues: { search: "" },
  });

  const searchValue = watch("search");

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onFilterSearch]);

  return (
    <form className="flex flex-col sm:flex-row w-full gap-3">
      <input
        placeholder="search Project..."
        {...register("search")}
        className="w-full p-2 border-2 border-border rounded focus:border-ring focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onFilterStatus("all")}
          className="px-3 py-1.5 border-2 border-border rounded focus:bg-[#21262d] transition-all duration-500"
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onFilterStatus("active")}
          className="px-3 py-1.5 border-2 border-border rounded focus:bg-[#21262d] transition-all duration-500"
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => onFilterStatus("complete")}
          className="px-3 py-1.5 border-2 border-border rounded focus:bg-[#21262d] transition-all duration-500"
        >
          Complete
        </button>

        <button
          type="button"
          onClick={() => onFilterStatus("filed")}
          className="px-3 py-1.5 border-2 border-border rounded focus:bg-[#21262d] transition-all duration-500"
        >
          Archived
        </button>
      </div>
    </form>
  );
}
