"use client";

import Button from "@/components/shared/Button";
import CheckBox from "@/components/shared/CheckBox";
import TextField from "@/components/shared/TextField";
import routes from "@/helpers/routes";
import { useSignatureMutation } from "@/lib/features/apis/propertyApi";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PropertySearchSignature = () => {
  const router = useRouter();
  const { selectedParcelNumber } = useAppSelector((state) => state.authedUser);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [sendSignature, { isLoading }] = useSignatureMutation();

  const handleSubmit = async () => {
    if (accepted && selectedParcelNumber) {
      try {
        await sendSignature({ accepted, parcelNumber: selectedParcelNumber }).unwrap();
        toast.success("Check your email");
        router.push(routes.home.root);
      } catch {}
    }
  };
  return (
    <div className="flex flex-col gap-10 px-4 md:px-8 lg:px-12 lx:px-16 2xl:px-20 py-10 flex flex-col gap-10">
      <div className="bg-green-900 rounded-2xl py-10 px-4 flex flex-col justify-center items-center gap-6">
        <h2 className="text-green text-2xl sm:text-3xl lg:text-4xl font-semibold">Your free valuation</h2>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">$95.000</h1>
      </div>
      <p className="text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus quis metus sed condimentum. Proin ac felis vel turpis
        pellentesque fringilla. Proin eleifend, odio in gravida elementum, augue mi cursus orci, ut venenatis dui nulla in orci. Maecenas a
        varius mauris, vel maximus enim. Donec vitae lobortis sem, vitae condimentum leo. Phasellus auctor eu nulla a bibendum. In hac
        habitasse platea dictumst. Donec lacinia accumsan elit et semper. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia curae; Nunc id ultrices magna. Donec dolor orci, tempus nec risus dictum, gravida hendrerit turpis. Sed commodo
        convallis tellus, sed finibus odio porta ut. Aliquam eu tempor ante, id eleifend mi. Phasellus consectetur tellus non vulputate
        dapibus. Aenean a nisl ipsum. In vel turpis ac justo maximus elementum vel congue turpis. Vivamus condimentum augue in accumsan
        imperdiet. Donec euismod lorem et quam bibendum, in aliquam nibh fringilla. Cras aliquam risus tortor, id lobortis orci ornare ut.
        Mauris ac rutrum dolor. Aenean leo turpis, venenatis quis dui a, laoreet elementum felis. Integer ullamcorper, nunc a pellentesque
        rhoncus, tellus elit rutrum ex, nec ornare nunc augue sed nulla. Quisque aliquet faucibus gravida. Vivamus tincidunt laoreet sapien
        sit amet tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec non eros
        finibus, imperdiet justo nec, dictum risus. Aenean luctus euismod tincidunt. Pellentesque lacinia nibh non libero elementum luctus.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec et mi arcu. Etiam at pretium ex, vitae
        mattis neque. Vivamus id nisi ac mi suscipit semper. Integer lobortis posuere nisi, vel blandit nisl fermentum sed. Sed sed risus
        vestibulum, consequat libero eu, imperdiet ipsum. Nunc lobortis magna non ante scelerisque cursus. Vivamus egestas at leo et
        euismod. Vivamus suscipit, lacus eu malesuada aliquam, est enim elementum tellus, id suscipit lorem massa non ligula. Vivamus
        pretium viverra sem, eget egestas metus gravida eu. Integer mollis, felis et tincidunt molestie, ex est iaculis tortor, eget commodo
        mi diam sit amet mi. Aliquam pulvinar suscipit risus, at accumsan elit sagittis a. In nec mauris rutrum, venenatis nibh dignissim,
        hendrerit eros. Quisque efficitur pretium arcu. Suspendisse non dolor interdum, egestas libero sit amet, ultricies libero. Morbi id
        nulla libero. Ut et nisl quis nisl porta tempor non ut magna. Aliquam erat volutpat. Sed tempus mattis nibh, at sagittis eros
        elementum sed. Aenean posuere luctus augue eu interdum. Donec pretium felis et massa dapibus dignissim. Nullam in tortor congue
        velit tempor bibendum. Nulla facilisi.
      </p>
      <CheckBox
        classNames="font-semibold"
        checked={accepted}
        onChange={() => setAccepted(!accepted)}
        label="I agree to the terms and conditions"
      />
      <p className="text-sm">
        Sed commodo convallis tellus, sed finibus odio porta ut. Aliquam eu tempor ante, id eleifend mi. Phasellus consectetur tellus non
        vulputate dapibus. Aenean a nisl ipsum. In vel turpis ac justo maximus elementum vel congue turpis. Vivamus condimentum augue in
        accumsan imperdiet. Donec euismod lorem et quam bibendum, in aliquam nibh fringilla. Cras aliquam risus tortor, id lobortis orci
        ornare ut.
      </p>
      <Button loading={isLoading} disabled={!accepted} onClick={handleSubmit}>
        SUBMIT
      </Button>
    </div>
  );
};

export default PropertySearchSignature;
