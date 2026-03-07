import TecnologiesPills from "../atoms/TecnologiesPills";
import ProgressBar from "./ProgressBar";

export default function ProjectDiv() {
  return (
    <div className="w-100 h-70 p-5 border-2 bg-surface border-border rounded transition duration-500 ease-in-out hover:-translate-y-1 hover:border-ring">
      <div className="flex gap-2">
        <div>
          <div>
            <h3 className="text-2xl font-bold">Taskly</h3>
          </div>
          <div>
            <p className="text-fg-secondary">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias
              eum officiis adipisci soluta quasi, nulla magni provident dolore
            </p>
          </div>
        </div>
        <div>
          <div className="bg-[#1a3327] py-1 px-3 rounded text-success">
            <p>Active</p>
          </div>
        </div>
      </div>

      <ProgressBar current={2} label="stories" total={23} />
      <div className="flex">
        <div className="flex gap-2 flex-wrap w-[70%]">
          <TecnologiesPills pillsName="React js" />
          <TecnologiesPills pillsName="React js" />
          <TecnologiesPills pillsName="React js" />
          <TecnologiesPills pillsName="React js" />
          <TecnologiesPills pillsName="React js" />
        </div>
        <div className="w-[30%]">
          <p>3 Topics</p>
          <p>2 weeks ago</p>
        </div>
      </div>
    </div>
  );
}
