import HomeHeader from "./components/molecules/HomeHeader";
import HomeSystem from "./components/organism/HomeSystem";

export default function HomePage() {
  return (
    <div className="p-10 flex flex-col gap-5">
      <HomeHeader />
      <HomeSystem />
    </div>
  );
}
