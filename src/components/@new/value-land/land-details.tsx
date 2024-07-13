import Button from "../shared/forms/Button";

const LandDetails = () => (
  <div className="space-y-8">
    <div className="mx-4 md:mx-6 lg:mx-8 lg:p-6 xl:p-8 lg:border lg:border-grey-100 rounded-2xl">content</div>
    <div className="border-t border-t-grey-100 flex flex-col sm:flex-row justify-end gap-3 px-4 md:px-6 lg:px-8 py-4">
      <Button variant="secondary">Back</Button>
      <Button>Continue</Button>
    </div>
  </div>
);

export default LandDetails;
