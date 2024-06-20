"use client";

import Avatar from "@/components/@new/shared/Avatar";
import Button from "@/components/@new/shared/forms/Button";
import clsx from "clsx";
import React, { useState } from "react";

const UploadImage = () => {
  const [avatar, setAvatar] = useState<File | null>(null);

  const onUpload = (files: FileList | null) => {
    if (files && files?.length > 0) {
      setAvatar(files[0]);
    }
  };
  return (
    <div className="flex items-center gap-6">
      <Avatar className="w-24 h-24 font-semibold" title="DN" src={avatar && URL.createObjectURL(avatar)} />
      <Button variant="secondary-green" className="h-12 relative">
        Upload Image{" "}
        <label htmlFor="upload" className="bg-error w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer">
          <input
            type="file"
            id="upload"
            hidden
            accept="image/png, image/gif, image/jpeg"
            onChange={(e) => {
              onUpload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </Button>
      <Button variant="secondary" className={clsx("h-12", avatar ? "opacity-1" : "opacity-0")} onClick={() => setAvatar(null)}>
        Delete
      </Button>
    </div>
  );
};

export default UploadImage;
