interface ITecnologiesPills {
  pillsName: string;
}

export default function TecnologiesPills({ pillsName }: ITecnologiesPills) {
  return (
    <div className="bg-overlay px-2 rounded">
      <p>{pillsName}</p>
    </div>
  );
}
