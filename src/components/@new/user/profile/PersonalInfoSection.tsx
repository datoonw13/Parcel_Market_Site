import React, { useState } from "react";
import clsx from "clsx";
import UserProfileSection from "./UserProfileSection";
import Button from "../../shared/forms/Button";
import { EditIcon1 } from "../../icons/EditIcons";
import TextField from "../../shared/forms/TextField";

const PersonalInfoSection = () => {
  const [editMode, setEditMode] = useState(false);
  return (
    <UserProfileSection
      sectionTitle="Personal Information"
      headerButton={
        <Button
          variant="text"
          className={clsx(editMode ? "opacity-0" : "opacity-1")}
          startIcon={<EditIcon1 />}
          onClick={() => setEditMode(true)}
        >
          Edit
        </Button>
      }
      actions={
        editMode && (
          <>
            <Button onClick={() => setEditMode(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={() => setEditMode(false)}>Save Changes</Button>
          </>
        )
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField disabled={!editMode} label="First Name" />
        <TextField disabled={!editMode} label="Last Name" />
        <TextField disabled={!editMode} label="State" />
        <TextField disabled={!editMode} label="County" />
        <TextField disabled={!editMode} label="Street Name" />
        <div className="grid grid-cols-2 gap-4">
          <TextField disabled={!editMode} label="Number" />
          <TextField disabled={!editMode} label="Floor, Unit" />
        </div>
        <TextField disabled={!editMode} label="Postal Code" />
        <TextField disabled={!editMode} label="City" />
      </div>
    </UserProfileSection>
  );
};

export default PersonalInfoSection;
