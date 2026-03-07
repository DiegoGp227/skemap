"use client";
import { useForm } from "react-hook-form";

type FormValues = {
  search: string;
  category: string;
};

export default function FilterForm() {
  const { register, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      search: "",
      category: "",
    },
  });

  const values = watch();

  const handleCategoryClick = (category: string) => {
    setValue("category", category);
  };

  const data = [
    { id: 1, name: "Laptop", category: "tech" },
    { id: 2, name: "Manzana", category: "food" },
    { id: 3, name: "Audífonos", category: "tech" },
  ];

  const filtered = data.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(values.search.toLowerCase());

    const matchCategory = values.category
      ? item.category === values.category
      : true;

    return matchSearch && matchCategory;
  });

  return (
    <form className="flex w-full justify-between gap-5">
      <input
        placeholder="search Project..."
        {...register("search")}
        className="w-full p-2 border-2 border-border rounded focus:border-ring focus:outline-none" 
      />

      <div className="flex gap-5">
        <button
          type="button"
          onClick={() => handleCategoryClick("all")}
          className="px-3 py-1.5 border-2 border-border rounded  focus:bg-[#21262d] transition-all duration-500"
        >
          All
        </button>

        <button
          type="button"
          onClick={() => handleCategoryClick("active")}
          className="px-3 py-1.5 border-2 border-border rounded  focus:bg-[#21262d] transition-all duration-500"
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => handleCategoryClick("complete")}
          className="px-3 py-1.5 border-2 border-border rounded focus:bg-[#21262d] transition-all duration-500"
        >
          Complete
        </button>

        <button
          type="button"
          onClick={() => handleCategoryClick("filed")}
          className="px-3 py-1.5 border-2 border-border rounded focus:bg-[#21262d] transition-all duration-500"
        >
          filed
        </button>
      </div>

      {/* <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul> */}
    </form>
  );
}
