"use client";

import React, { useEffect, useState } from "react";
import { IStripePaymentMethods } from "@/types/subscriptions";
import TextField from "@/components/@new/shared/forms/text-field";
import RadioButton from "@/components/@new/shared/forms/RadioButton";
import clsx from "clsx";
import Button from "@/components/@new/shared/forms/Button";
import { RemoveIcon1, RemoveIcon2 } from "@/components/@new/icons/RemoveIcons";
import { addPaymentMethodAction, removePaymentMethodsAction } from "@/server-actions/subscription/actions";
import ResponsiveWarningModal from "@/components/@new/shared/modals/ResponsiveWarningModal";
import useNotification from "@/hooks/useNotification";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TextInput } from "@/components/ui/input";
import PaymentDetailsItem from "../payment-details-item";
import CardIcon from "../card-icon";

const PaymentMethods = ({ initialData }: { initialData: (IStripePaymentMethods[0] & { deleted: boolean })[] }) => {
  const { notify } = useNotification();
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState<(IStripePaymentMethods[0] & { deleted: boolean })[]>([]);
  const [pending, setPending] = useState(false);
  const [removeItem, setRemoveItem] = useState<(IStripePaymentMethods[0] & { deleted: boolean }) | null>(null);

  const handleSave = async () => {
    setPending(true);
    const oldDefaultCardId = initialData.find((el) => el.isDefault)?.id;
    const newDefaultCardId = data.find((el) => el.isDefault)?.id;

    if (oldDefaultCardId !== newDefaultCardId && newDefaultCardId) {
      await addPaymentMethodAction(newDefaultCardId);
    }

    const removedCardIds = data.filter((el) => el.deleted).map((el) => el.id);
    if (removedCardIds.length > 0) {
      await removePaymentMethodsAction(removedCardIds);
      notify({ description: "Plan has been successfully changed", title: "Your card has been deleted" });
    }
    setPending(false);
    setEdit(false);
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <>
      <ResponsiveWarningModal
        variant="error"
        open={!!removeItem}
        closeModal={() => setRemoveItem(null)}
        description={`**** **** **** ${removeItem?.last4}`}
        title="Are you sure you want to delete this card"
        onOK={() => {
          const newData = data.map((item) => ({ ...item, deleted: item.id === removeItem?.id ? true : item.deleted }));
          setData([...newData]);
          setRemoveItem(null);
        }}
        onCancel={() => setRemoveItem(null)}
        okLabel="Delete"
        cancelLabel="Cancel"
        customIcon={<RemoveIcon1 className="!w-4 !h-4 min-w-4 min-h-4" color="error" />}
      />
      <div className="space-y-3">
        <PaymentDetailsItem
          buttonClassName={clsx(edit && "hidden")}
          title="My Payment Methods"
          buttonLabel="Edit"
          onClick={() => setEdit(true)}
        />
        {!edit && (
          <div className="grid gird-cols-1 sm:grid-cols-2 gap-3 gap-x-8">
            {data
              ?.filter((x) => !x.deleted)
              .map((el) => (
                <TextInput
                  key={el.id}
                  disabled
                  value={`***** **** **** ${el.last4}`}
                  label={el.name}
                  endIcon={<CardIcon card={el.brand} />}
                />
              ))}
          </div>
        )}

        {edit && (
          <>
            <RadioGroup
              value={data.find((el) => el.isDefault)?.id || ""}
              onValueChange={(newValueId) => {
                const newData = data.map((el) => ({ ...el, isDefault: el.id === newValueId }));
                setData(newData);
              }}
              className="grid gird-cols-1 sm:grid-cols-2 gap-3 gap-x-8"
            >
              {data
                ?.filter((x) => !x.deleted)
                .map((el) => (
                  <div key={el.id} className="flex items-center gap-3 w-full">
                    <RadioGroupItem
                      label={
                        <div className="relative">
                          <TextInput
                            disabled
                            value={`***** **** **** ${el.last4}`}
                            label={el.name}
                            endIcon={<CardIcon card={el.brand} />}
                          />
                          <div className="w-full h-full rounded-2xl bg-error/0 z-10 absolute top-0" />
                        </div>
                      }
                      value={el.id}
                      onChange={() => {
                        const newData = data.map((item) => ({ ...item, isDefault: item.id === el.id }));
                        setData([...newData]);
                      }}
                    />
                    {edit && (
                      <Button
                        onClick={() => {
                          setRemoveItem(el);
                        }}
                        variant="secondary"
                        className="!outline-none !p-0 w-8 h-8 rounded-full hover:bg-error-100 flex items-center justify-center group !bg-white"
                      >
                        <RemoveIcon1 className="fill-error" />
                      </Button>
                    )}
                  </div>
                ))}
            </RadioGroup>
            <div className="flex items-center sm:justify-end gap-3 mt-1 border-t border-t-grey-100 pt-4 pb-1">
              <Button
                variant="secondary"
                className="w-full sm:w-fit"
                onClick={() => {
                  setEdit(false);
                  setData(initialData);
                }}
              >
                Cancel
              </Button>
              <Button className="w-full sm:w-fit" onClick={handleSave} loading={pending}>
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PaymentMethods;
