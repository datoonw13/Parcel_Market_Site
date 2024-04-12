import React from "react";
import Button from "../shared/Button";
import Divider from "../shared/Divider";

const UserAccountTab = () => (
  <div className="border border-grey-100 rounded p-10">
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-green-800 font-bricolage font-extrabold mb-4 text-center sm:text-start">Public Profile</p>
        <p className="text-lg text-center sm:text-start">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut orci et mauris finibus accumsan. Phasellus dictum ultricies
          condimentum. Nunc congue non sapien quis elementum. Duis rutrum sapien tortor. Quisque ac rutrum tortor. Vivamus porttitor enim id
          felis congue, ut sagittis est rhoncus.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
        <p className="text-lg font-bold m-auto sm:m-0">Profile Image</p>
        <div className="w-[80px] h-[80px] rounded-full bg-error flex items-center justify-center m-auto">IM</div>
        <div className="w-full sm:w-fit ml-auto">
          <Button type="tertiary" classNames="w-full sm:w-[95px]">
            Change
          </Button>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
        <p className="text-lg font-bold m-auto sm:m-0">Profile Name</p>
        <p className="text-lg text-center truncate">John Doe</p>
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
        <p className="text-lg text-center truncate w-full">johndoe@parcelmarket.com</p>
        <div className="w-full sm:w-fit ml-auto">
          <Button type="tertiary" classNames="w-full sm:w-[95px]">
            Change
          </Button>
        </div>
      </div>
      <Divider />
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 justify-between">
        <p className="text-lg font-bold m-auto sm:m-0">Contact Number</p>
        <p className="text-lg text-center truncate">+1 23456789</p>
        <div className="w-full sm:w-fit ml-auto">
          <Button type="tertiary" classNames="w-full sm:w-[95px]">
            Change
          </Button>
        </div>
      </div>
      <Divider />
    </div>
  </div>
);

export default UserAccountTab;
