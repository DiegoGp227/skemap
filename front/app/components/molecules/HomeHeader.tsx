import HeaderProjectsInfo from "./HeaderProjectsInfo";

export default function HomeHeader() {
  return (
    <div className="flex justify-between h-full">
      <HeaderProjectsInfo />
      <div className="flex h-full items-center justify-center">
        <button className="bg-blue-600 py-2 px-5 cursor-pointer rounded">New Project</button>
      </div>
    </div>
  );
}
