import React from "react";
import UserProfileSection from "./UserProfileSection";
import Button from "../../shared/forms/Button";
import { EditIcon1 } from "../../icons/EditIcons";
import TextField from "../../shared/forms/TextField";

const PersonalInfoSection = () => (
  <UserProfileSection
    sectionTitle="Personal Information"
    headerButton={
      <Button variant="text" startIcon={<EditIcon1 />}>
        Edit
      </Button>
    }
  >
    <div className="grid grid-cols-2 gap-4">
      <TextField label="First Name" />
      <TextField label="Last Name" />
      <TextField label="State" />
      <TextField label="County" />
      <TextField label="Street Name" />
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Number" />
        <TextField label="Floor, Unit" />
      </div>
      <TextField label="Postal Code" />
      <TextField label="City" />
    </div>
  </UserProfileSection>
);

export default PersonalInfoSection;
