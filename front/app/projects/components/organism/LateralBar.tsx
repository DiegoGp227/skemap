import FilterProject from "../molecules/FilterProject";
import InfoProject from "../molecules/InfoProject";
import EpicSecction from "./EpicSecction";

interface LateralBarProps {
  setTaskStatus: any;
}

export default function LateralBar({setTaskStatus}: LateralBarProps) {
  return (
    <section className="h-full max-w-72">
      <InfoProject
        tecnologies=""
        title="Discipline App Discipline App Discipline AppDiscipline AppDiscipline App"
        color="#00FF00"
        current={23}
        total={25}
      />
      <FilterProject />
      <EpicSecction />
    </section>
  );
}
