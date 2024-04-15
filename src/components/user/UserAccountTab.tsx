import React, { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useUpdateProfileMutation } from "@/lib/features/apis/authApi";
import Button from "../shared/Button";
import Divider from "../shared/Divider";
import Avatar from "../shared/Avatar";

const UserAccountTab = () => {
  const { user } = useAppSelector((state) => state.authedUser);
  const [newImage, setNewImage] = useState<File | null>(null);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleImageUpdate = async () => {
    try {
      if (!newImage) {
        throw new Error();
      }
      await updateProfile(newImage).unwrap();
      setNewImage(null);
    } catch (error) {}
  };

  const generateImageUrl = () => {
    if (newImage) {
      return URL.createObjectURL(newImage);
    }
    if (user?.image) {
      return `http://64.23.229.149:4000/${user.image}`;
    }
    return null;
  };

  return (
    <div className="border border-grey-100 rounded p-10">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-green-800 font-bricolage font-extrabold mb-4 text-center sm:text-start">Public Profile</p>
          <p className="text-lg text-center sm:text-start">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut orci et mauris finibus accumsan. Phasellus dictum ultricies
            condimentum. Nunc congue non sapien quis elementum. Duis rutrum sapien tortor. Quisque ac rutrum tortor. Vivamus porttitor enim
            id felis congue, ut sagittis est rhoncus.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
          <p className="text-lg font-bold m-auto sm:m-0">Profile Image</p>
          <div className="rounded-full flex items-center justify-center m-auto">
            <Avatar className="w-[80px] h-[80px]" src={generateImageUrl()} />
          </div>
          <div className="w-full sm:w-fit ml-auto flex gap-2">
            {newImage ? (
              <>
                <Button disabled={isLoading} color="error" type="tertiary" classNames="w-[95px]" onClick={() => setNewImage(null)}>
                  Cancel
                </Button>
                <Button type="tertiary" classNames="w-[95px]" onClick={handleImageUpdate} loading={isLoading}>
                  Save
                </Button>
              </>
            ) : (
              <Button type="tertiary" classNames="w-full sm:w-[95px] relative">
                <input
                  onChange={(e) => setNewImage(e?.target?.files?.[0] || null)}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="absolute w-full left-0 top-0 indent-[-999px] cursor-pointer h-full"
                />
                Change
              </Button>
            )}
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
          <p className="text-lg font-bold m-auto sm:m-0">Profile Name</p>
          <p className="text-lg text-center truncate">{`${user?.name}`}</p>
          <div className="w-full sm:w-fit ml-auto">
            <Button type="tertiary" classNames="w-full sm:w-[95px]">
              Change
            </Button>
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
          <p className="text-lg font-bold m-auto sm:m-0">Company</p>
          <p className="text-lg text-center truncate">Not added</p>
          <div className="w-full sm:w-fit ml-auto">
            <Button type="tertiary" classNames="w-full sm:w-[95px]">
              Add
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-10">
        <div>
          <p className="text-green-800 font-bricolage font-extrabold mb-4 text-center sm:text-start">Account information and access</p>
          <p className="text-lg text-center sm:text-start">
            Account information and access Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut orci et mauris finibus
            accumsan. Phasellus dictum ultricies condimentum. Nunc congue non sapien quis elementum. Duis rutrum sapien tortor. Quisque ac
            rutrum tortor. Vivamus porttitor enim id felis congue, ut sagittis est rhoncus.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
          <p className="text-lg font-bold m-auto sm:m-0">Email</p>
          <p className="text-lg text-center truncate w-full">{user?.email}</p>
          <div className="w-full sm:w-fit ml-auto">
            <Button type="tertiary" classNames="w-full sm:w-[95px]">
              Change
            </Button>
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
          <p className="text-lg font-bold m-auto sm:m-0">Contact Number</p>
          <p className="text-lg text-center truncate">{user?.mobileNumber || "-"}</p>
          <div className="w-full sm:w-fit ml-auto">
            <Button type="tertiary" classNames="w-full sm:w-[95px]">
              Change
            </Button>
          </div>
        </div>
        <Divider />
      </div>
      <Button type="tertiary" color="error" classNames="mb-10 m-auto mt-6">
        Deactivate Account
      </Button>
    </div>
  );
};

export default UserAccountTab;
