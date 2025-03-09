import HomeHeaderWrapper from "@/components/home-new/header/header-wrapper";
import SlideShow from "@/components/home-new/slideshow";
import { getUserAction } from "@/server-actions/user/actions";

const HomePage = async () => {
  const user = await getUserAction();
  return (
    <div className="">
      <div className="h-screen lg:h-[76.5vh] flex flex-col">
        <HomeHeaderWrapper user={user} />
        <SlideShow />
      </div>
      <div>ae</div>
    </div>
  );
};

export default HomePage;
