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
        description={`Delete **** **** **** ${removeItem?.last4} ?`}
        title="Are you sure you want to delete this Card"
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
        <div className="grid gird-cols-1 sm:grid-cols-2 gap-3 gap-x-8">
          {data
            ?.filter((x) => !x.deleted)
            .map((el) => (
              <div key={el.id} className="flex items-center gap-3">
                <RadioButton
                  rootClassName={clsx("w-full", !edit && "[&>input]:hidden")}
                  labelClassName="w-full"
                  label={
                    <TextField
                      disabled
                      variant="primary"
                      value={`***** **** **** ${el.last4}`}
                      label={el.name}
                      endIcon={<CardIcon card={el.brand} />}
                    />
                  }
                  checked={el.isDefault}
                  name={el.id}
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
        </div>
        {edit && (
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
        )}
      </div>
    </>
  );
};

export default PaymentMethods;
