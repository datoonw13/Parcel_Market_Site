"use client";

// @ts-ignore
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { IUser } from "@/types/auth";
import { updateUserInfoSchema } from "@/zod-validations/auth-validations";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllStates } from "@/helpers/states";
import { updateUserInfoAction } from "@/server-actions/user/actions";
import toast from "react-hot-toast";
import useNotification from "@/hooks/useNotification";
import { CiEdit } from "react-icons/ci";
import TextField from "../../shared/forms/text-field";
import Button from "../../shared/forms/Button";
import UserProfileSection from "./UserProfileSection";
import AutoComplete from "../../shared/forms/AutoComplete";

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
      city: "",
      email: "",
      firstName: "",
      lastName: "",
      postalCode: "",
      state: "",
      streetName: "",
      unitNumber: "",
    },
  });

  const resetForm = useCallback(() => {
    reset({
      city: user.city,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      postalCode: user.postalCode,
      state: user.state,
      streetName: user.streetName,
      unitNumber: user.unitNumber || "",
    });
  }, [reset, user.city, user.email, user.firstName, user.lastName, user.postalCode, user.state, user.streetName, user.unitNumber]);

  const onSubmit = handleSubmit(async (data) => {
    const { errorMessage } = await updateUserInfoAction(data);
    if (errorMessage) {
      notify({ title: errorMessage }, { variant: "error" });
      toast.error(errorMessage);
    } else {
      notify({ title: "Personal Information", description: "Your Information has been successfully Updated." });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2 xl:col-span-1">
          <TextField
            required
            value={watch("firstName") || ""}
            error={!!errors.firstName}
            onChange={(firstName) => setValue("firstName", firstName, { shouldValidate: isSubmitted, shouldDirty: true })}
            disabled={!editMode}
            label="First Name"
          />
          <TextField
            required
            value={watch("lastName") || ""}
            error={!!errors.lastName}
            onChange={(lastName) => setValue("lastName", lastName, { shouldValidate: isSubmitted, shouldDirty: true })}
            disabled={!editMode}
            label="Last Name"
          />
        </div>
        <TextField
          required
          value={watch("streetName") || ""}
          error={!!errors.streetName}
          onChange={(streetName) => setValue("streetName", streetName, { shouldValidate: isSubmitted, shouldDirty: true })}
          disabled={!editMode}
          label="Address"
        />
        <TextField
          value={watch("unitNumber") || ""}
          error={!!errors.unitNumber}
          onChange={(unitNumber) => setValue("unitNumber", unitNumber, { shouldValidate: isSubmitted, shouldDirty: true })}
          disabled={!editMode}
          label="Unit Number"
        />
        <TextField
          required
          value={watch("city") || ""}
          error={!!errors.city}
          onChange={(city) => setValue("city", city, { shouldValidate: isSubmitted, shouldDirty: true })}
          disabled={!editMode}
          label="City"
        />
        <AutoComplete
          disableClear
          disabled={!editMode}
          options={getAllStates({ filterBlackList: false })}
          getOptionLabel={(item) => item.label}
          getOptionKey={(item) => item.value}
          onChange={(item) => {
            if (item?.value) {
              setValue("state", item.value, { shouldValidate: isSubmitted, shouldDirty: true });
            }
          }}
          placeholder="State"
          value={getAllStates().find((el) => el.value === watch("state")) || null}
          onFilter={(searchValue, items) =>
            items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
          }
          required
          getSelectedOption={(item) => item.value === watch("state")}
          error={!!errors.state}
        />
        <TextField
          required
          value={watch("postalCode") || ""}
          error={!!errors.postalCode}
          onChange={(postalCode) => setValue("postalCode", postalCode, { shouldValidate: isSubmitted, shouldDirty: true })}
          disabled={!editMode}
          label="Postal Code"
        />
      </div>
    </UserProfileSection>
  );
};

export default PersonalInfoSection;
