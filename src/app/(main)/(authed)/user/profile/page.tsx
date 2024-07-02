import AdditionalInfoSection from "@/components/@new/user/profile/AdditionalInfoSection";
import PersonalInfoSection from "@/components/@new/user/profile/PersonalInfoSection";
import UploadImage from "@/components/@new/user/profile/UploadImage";
import { getUserFullDetails } from "@/server-actions/user-actions";

const UserProfilePage = async () => {
  const userDetails = await getUserFullDetails();
  return (
    <div className="grid gap-6">
      {userDetails && (
        <>
          <UploadImage />
          <PersonalInfoSection />
          <AdditionalInfoSection user={userDetails} />
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
