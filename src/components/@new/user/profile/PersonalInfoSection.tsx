"use client";

// @ts-ignore
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { IUser } from "@/types/auth";
import { updateUserInfoSchema } from "@/zod-validations/auth-validations";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserInfoAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import useNotification from "@/hooks/useNotification";
import { CiEdit } from "react-icons/ci";
import { TextInput } from "@/components/ui/input";
import Button from "../../shared/forms/Button";
import UserProfileSection from "./UserProfileSection";

const PersonalInfoSection = ({ user }: { user: IUser }) => {
  const { notify } = useNotification();
  const [editMode, setEditMode] = useState(false);
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<z.infer<typeof updateUserInfoSchema>>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const resetForm = useCallback(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }, [reset, user.firstName, user.lastName]);

  const onSubmit = handleSubmit(async (data) => {
    const { errorMessage } = await updateUserInfoAction(data);
    if (errorMessage) {
      notify({ title: errorMessage }, { variant: "error" });
      toast.error(errorMessage);
    } else {
      notify({ title: "Information has been updated", description: "Your Information has been successfully Updated." });
      setEditMode(false);
    }
  });

  useEffect(() => {
    resetForm();
  }, [resetForm, user]);

  return (
    <UserProfileSection
      sectionTitle="Personal Information"
      headerButton={
        <Button
          variant="secondary"
          className={clsx(
            editMode ? "opacity-0 pointer-events-none" : "opacity-1",
            "!outline-none !text-primary-main [&>svg>*]:!fill-primary-main !p-0"
          )}
          startIcon={CiEdit}
          onClick={() => setEditMode(true)}
        >
          Edit
        </Button>
      }
      actions={
        editMode && (
          <>
            <Button
              className="w-full sm:w-fit"
              onClick={() => {
                setEditMode(false);
                resetForm();
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button className="w-full sm:w-fit" onClick={onSubmit} loading={isSubmitting} disabled={!isDirty}>
              Save Changes
            </Button>
          </>
        )
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          required
          value={watch("firstName") || ""}
          error={!!errors.firstName}
          onChange={(e) => setValue("firstName", e.target.value, { shouldValidate: isSubmitted, shouldDirty: true })}
          disabled={!editMode}
          label="First Name"
        />
        <TextInput
          required
          value={watch("lastName") || ""}
          error={!!errors.lastName}
          onChange={(e) => setValue("lastName", e.target.value, { shouldValidate: isSubmitted, shouldDirty: true })}
          disabled={!editMode}
          label="Last Name"
        />
      </div>
    </UserProfileSection>
  );
};

export default PersonalInfoSection;
