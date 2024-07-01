import React from 'react'
import Divider from "@/components/@new/shared/Divider";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import GoogleButton from "@/components/@new/shared/forms/Button/GoogleButton";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { getAllStates } from "@/helpers/states";
import Link from "next/link";
import TextField from '../shared/forms/TextField';

const SignUp = () => {
  return (
    <>
    <div>
      <h1 className="font-semibold text-2xl md:text-5xl text-center">Sign Up</h1>
      <h3 className="text-grey-800 mt-3 text-center">Create account</h3>
    </div>
    <GoogleButton className="!w-fit px-14" onClick={() => {}} />
    <Divider label="OR" className="mt-1.5" />
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TextField required className="w-full" label="First Name" />
      <TextField required className="w-full" label="Last Name" />
      <TextField required className="w-full" label="Email Address" />
      <TextField required className="w-full" label="Street Address" />
      <TextField className="w-full" label="Unit Number" />
      <AutoComplete
        options={getAllStates()}
        getOptionLabel={(item) => item.label}
        getOptionKey={(item) => item.value}
        onChange={(item) => {}}
        placeholder="State"
        value={null}
        onFilter={(searchValue, items) => items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))}
        required
        // getSelectedOption={(item) => item.value === filters.state}
      />
      <AutoComplete
        options={getAllStates()}
        getOptionLabel={(item) => item.label}
        getOptionKey={(item) => item.value}
        onChange={(item) => {}}
        placeholder="City"
        value={null}
        onFilter={(searchValue, items) => items.filter((item) => item.label.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))}
        required
        // getSelectedOption={(item) => item.value === filters.state}
      />
      <TextField required className="w-full" label="Postal Code" />
      <TextField className="w-full" label="Password" />
      <TextField className="w-full" label="Retype Password" />
      <CheckBox label="Send me emails with tips on how to find talent that fits my needs." className="col-span-2" />
      <CheckBox
        label={
          <p>
            Yes, I understand and agree to the Parcel Market{" "}
            <Link href="/">
              <span className="underline text-primary-main px-1">Terms of Service</span>
            </Link>
            and
            <Link href="/">
              <span className="underline text-primary-main px-1">Privacy Policy.</span>
            </Link>
          </p>
        }
        className="col-span-2"
      />
    </div>
    </>
  )
}

export default SignUp