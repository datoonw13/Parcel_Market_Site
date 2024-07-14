import AdditionalInfoSection from "@/components/@new/user/profile/AdditionalInfoSection";
import PersonalInfoSection from "@/components/@new/user/profile/PersonalInfoSection";
import UploadImage from "@/components/@new/user/profile/UploadImage";
import { getUserFullDetailsAction } from "@/server-actions/user/actions";

const UserProfilePage = async () => {
  const { data } = await getUserFullDetailsAction();

  return (
    <div className="grid gap-6">
      {data && (
        <>
          <UploadImage />
          <PersonalInfoSection />
          <AdditionalInfoSection user={data} />
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
