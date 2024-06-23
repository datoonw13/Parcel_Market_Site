"use client";

import Avatar from "@/components/@new/shared/Avatar";
import Drawer from "@/components/@new/shared/Drawer";
import Modal from "@/components/@new/shared/Modal";
import Popper from "@/components/@new/shared/Popper";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";
import { getAllStates } from "@/helpers/states";
import { useState } from "react";

export default function PlaygroundPage() {
  const [value, setValue] = useState<any>(null);
  const [open, setOpen] = useState(false);
  return (
    <main className="space-y-8 mb-44 max-w-6xl m-auto">
      <h1 className="text-4xl mt-8">Playground</h1>
      <div>
        <h2 className="mb-4 text-lg font-mono">Popper</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8 mt-96">
          {/* <Popper
            renderButton={(setReferenceElement, referenceElement) => (
              <input onClick={(e) => setReferenceElement(referenceElement ? null : e.currentTarget)} className="font-semibold" />
            )}
          >
            <div className="shadow-lg p-4 bg-primary-main-600 rounded-lg">Popper Content</div>
          </Popper> */}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">Avatar</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <Avatar title="LA" />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">TextField</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <TextField endIcon={<p className="">qdwd</p>} label="Primary" />
          <TextField variant="secondary" label="secondary" />
          <TextField variant="primary" placeholder="placeholder" />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">AutoComplete</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <AutoComplete
            options={getAllStates()}
            getOptionLabel={(item) => item.label}
            getOptionKey={(item) => item.value}
            onChange={(item) => setValue(item)}
            value={value}
            onFilter={(searchValue, items) =>
              items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
            }
            // value={value}
            // options={getAllStates()}
            // onChange={(data) => setValue(data)}
            // renderInput={(searchValue, setSearchValue) => (
            //   <TextField
            //     label="State"
            //     value={searchValue !== null ? searchValue : value?.label || ""}
            //     onChange={(e) => setSearchValue(e)}
            //   />
            // )}
          />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">Button</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </div>
      <button type="button" onClick={() => setOpen(true)}>
        wqdwqd
      </button>
      <Drawer title="Sort By ragac" open={open} closeModal={() => setOpen(false)}>
        <div className="h-[150px]">qwd</div>
      </Drawer>
    </main>
  );
}
