import AdditionalInfoSection from "@/components/@new/user/profile/AdditionalInfoSection";
import PersonalInfoSection from "@/components/@new/user/profile/PersonalInfoSection";
import UploadImage from "@/components/@new/user/profile/UploadImage";

const UserProfilePage = async () => (
  <div className="grid gap-6">
    <>
      <UploadImage />
      <PersonalInfoSection />
      <AdditionalInfoSection />
    </>
  </div>
);

export default UserProfilePage;
