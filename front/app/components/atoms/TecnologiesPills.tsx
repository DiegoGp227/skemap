interface ITecnologiesPills {
  pillsName: string;
}

export default function TecnologiesPills({ pillsName }: ITecnologiesPills) {
  return (
    <div className="bg-overlay px-2 rounded-2xl h-5 text-xs">
      <p>{pillsName}</p>
    </div>
  );
}
