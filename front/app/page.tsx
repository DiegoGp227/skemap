import HomeHeader from "./components/molecules/HomeHeader";
import HomeSistem from "./components/organism/HomeSistem";

export default function HomePage() {
  return (
    <div className="p-10 flex flex-col gap-5">
      <HomeHeader />
      <HomeSistem />
    </div>
  );
}
