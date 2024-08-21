import AdditionalInfoSection from "@/components/@new/user/profile/AdditionalInfoSection";
import PersonalInfoSection from "@/components/@new/user/profile/PersonalInfoSection";
// import UploadImage from "@/components/@new/user/profile/UploadImage";
import { getUserAction, getUserFullDetailsAction } from "@/server-actions/user/actions";

const UserProfilePage = async () => {
  const { data } = await getUserFullDetailsAction();
  const userOptions = await getUserAction();

  return (
    <div className="grid gap-6">
      {data && (
        <>
          {/* <UploadImage /> */}
          <PersonalInfoSection user={data} />
          <AdditionalInfoSection user={data} isGoogleUser={!!userOptions?.isGoogleUser} />
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
