import HomeHeaderWrapper from "@/components/home-new/header/header-wrapper";
import ScheduleDemo from "@/components/home-new/schedule-demo";
import SlideShow from "@/components/home-new/slideshow/slideshow";
import VoltDescription from "@/components/home-new/volt-description/volt-description";
import VoltVideo from "@/components/home-new/volt-video";
import { getUserAction } from "@/server-actions/user/actions";

const HomePage = async () => {
  const user = await getUserAction();
  return (
    <div className="bg-[#fdfdfd]">
      <div className="h-screen lg:h-[76.5vh] flex flex-col">
        <HomeHeaderWrapper user={user} />
        <SlideShow />
      </div>
      <VoltDescription />
      <VoltVideo />
      <ScheduleDemo />
      <div className="mt-20">qwd</div>
    </div>
  );
};

export default HomePage;
