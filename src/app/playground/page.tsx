"use client";

import Avatar from "@/components/@new/shared/Avatar";
import Drawer from "@/components/@new/shared/modals/Drawer";
import Modal from "@/components/@new/shared/modals/Modal";
import Popper from "@/components/@new/shared/Popper";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import Button from "@/components/@new/shared/forms/Button";
import { getAllStates } from "@/helpers/states";
import { useState } from "react";
import { CalendarIcon1 } from "@/components/@new/icons/CalendarIcons";
import { ArrowIconDown1 } from "@/components/@new/icons/ArrowIcons";
import { BookIcon1 } from "@/components/@new/icons/BookIcons";
import TextField from "@/components/@new/shared/forms/text-field";

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
          {/* <TextField endIcon={Button} label="Primary" /> */}
          <TextField variant="secondary" label="secondary" />
          <TextField variant="primary" placeholder="placeholder" />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">AutoComplete</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <AutoComplete
            options={getAllStates({ filterBlackList: true })}
            getOptionLabel={(item) => item.label}
            getOptionKey={(item) => item.value}
            onChange={(item) => setValue(item)}
            value={value}
            getSelectedOption={(item, selectedValue) => item.value === selectedValue?.value}
            onFilter={(searchValue, items) =>
              items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
            }
            // value={value}
            // options={getAllStates({ filterBlackList:true })}
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
        <h2 className="mb-4 text-lg font-mono">Button Primary</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="space-y-8">
          <div className="flex space-x-8">
            <Button variant="primary" loading color="default" size="sm" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Default
            </Button>
            <Button variant="primary" loading color="default" size="sm" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Default disabled
            </Button>
          </div>
          <div className="flex space-x-8">
            <Button variant="primary" loading color="error" size="sm" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Error
            </Button>
            <Button variant="primary" loading color="error" size="sm" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Error disabled
            </Button>
          </div>

          <div className="flex space-x-8">
            <Button variant="primary" loading color="default" size="md" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Default
            </Button>
            <Button variant="primary" loading color="default" size="md" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Default disabled
            </Button>
          </div>
          <div className="flex space-x-8">
            <Button variant="primary" loading color="error" size="md" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Error
            </Button>
            <Button variant="primary" loading color="error" size="md" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Error disabled
            </Button>
          </div>

          <div className="flex space-x-8">
            <Button variant="primary" loading color="default" size="lg" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Default
            </Button>
            <Button variant="primary" loading color="default" size="lg" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Default disabled
            </Button>
          </div>
          <div className="flex space-x-8">
            <Button variant="primary" loading color="error" size="lg" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Error
            </Button>
            <Button variant="primary" loading color="error" size="lg" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Error disabled
            </Button>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">Button Secondary</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="space-y-8">
          <div className="flex space-x-8">
            <Button variant="secondary" color="default" size="sm" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Default
            </Button>
            <Button variant="secondary" color="default" size="sm" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Default disabled
            </Button>
          </div>
          <div className="flex space-x-8">
            <Button variant="secondary" color="error" size="sm" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Error
            </Button>
            <Button variant="secondary" color="error" size="sm" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Sm Error disabled
            </Button>
          </div>

          <div className="flex space-x-8">
            <Button variant="secondary" color="default" size="md" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Default
            </Button>
            <Button variant="secondary" color="default" size="md" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Default disabled
            </Button>
          </div>
          <div className="flex space-x-8">
            <Button variant="secondary" color="error" size="md" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Error
            </Button>
            <Button variant="secondary" color="error" size="md" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Md Error disabled
            </Button>
          </div>

          <div className="flex space-x-8">
            <Button variant="secondary" color="default" size="lg" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Default
            </Button>
            <Button variant="secondary" color="default" size="lg" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Default disabled
            </Button>
          </div>
          <div className="flex space-x-8">
            <Button variant="secondary" color="error" size="lg" startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Error
            </Button>
            <Button variant="secondary" color="error" size="lg" disabled startIcon={BookIcon1} endIcon={CalendarIcon1}>
              Primary Lg Error disabled
            </Button>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => setOpen(true)}>
        wqdwqd
      </button>
      <Drawer title="Sort By ragac" open={open} closeDrawer={() => setOpen(false)}>
        <div className="h-[150px]">qwd</div>
      </Drawer>
    </main>
  );
}
