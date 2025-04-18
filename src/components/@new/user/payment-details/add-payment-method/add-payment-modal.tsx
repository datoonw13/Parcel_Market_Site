import { FC, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import { addPaymentMethodAction } from "@/server-actions/subscription/actions";
import TextField from "@/components/@new/shared/forms/text-field";
import useNotification from "@/hooks/useNotification";
import { RemoveIcon2 } from "../../../icons/RemoveIcons";
import Button from "../../../shared/forms/Button";
import ResponsiveModal from "../../../shared/modals/ResponsiveModal";

interface AddPaymentModalProps {
  open: boolean;
  closeModal: () => void;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");
const Content: FC<AddPaymentModalProps> = ({ closeModal, open }) => {
  const { notify } = useNotification();
  const [addPending, setAddPending] = useState(false);
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (event: any, elements: any, stripe: any) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    setAddPending(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: fullName,
      },
    });
    if (paymentMethod) {
      const { errorMessage } = await addPaymentMethodAction(paymentMethod.id);

      if (!errorMessage) {
        notify({ title: "Payment method has been added", description: "Plan has been successfully changed" });
        closeModal();
      }
    }
    setAddPending(false);
  };

  return (
    <div className="w-full md:bg-white md:shadow-4 rounded-2xl flex flex-col">
      <div className="flex items-center justify-between gap-2 px-5 py-4 md:px-8 md:py-6 md:border-b md:border-b-grey-100">
        <h1 className="text-lg font-semibold">Add Payment Method</h1>
        <Button variant="secondary" className="!p-0 !outline-none !w-6 !h-6 hidden md:block" onClick={closeModal}>
          <RemoveIcon2 className="!w-3 !h-3" color="grey-600" />
        </Button>
      </div>
      <div className="px-5 md:px-8 md:my-6">
        <Elements stripe={stripePromise}>
          <ElementsConsumer>
            {({ elements, stripe }) => (
              <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                <TextField className="mb-3" label="Full name on card" value={fullName} onChange={(value) => setFullName(value)} />
                <CardElement className="border border-grey-100 rounded-lg py-4 px-6" options={{ hidePostalCode: true }} />
                <div className="flex gap-3 flex-col-reverse sm:flex-row sm:justify-end py-4 border-t border-t-grey-100 mt-7">
                  <Button className="w-full" variant="secondary" onClick={closeModal}>
                    Close
                  </Button>
                  <Button className="w-full" type="submit" disabled={!stripe || fullName.length < 3} loading={addPending}>
                    Add Card
                  </Button>
                </div>
              </form>
            )}
          </ElementsConsumer>
        </Elements>
      </div>
    </div>
  );
};

const AddPaymentModal: FC<AddPaymentModalProps> = (props) => {
  const { closeModal, open } = props;
  return (
    <ResponsiveModal
      content={<Content {...props} />}
      responsiveContent={<Content {...props} />}
      open={open}
      handleClose={closeModal}
      desktopModalContentClasses="max-w-lg w-full mx-16"
    />
  );
};

export default AddPaymentModal;
