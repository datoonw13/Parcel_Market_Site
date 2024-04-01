import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";

const PropertyAbout = () => (
  <div className="flex flex-col gap-6">
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">Does your property have a water feature such as a lake or stream?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge select label="Yes" />
        <Badge label="No" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">Is your property water front?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge select label="Yes" />
        <Badge label="No" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">What is your land cover type?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge select label="Wooded" />
        <Badge label="Open field" />
        <Badge label="mixed" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">What is the property condition?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge select label="Clean and Ready to build on" />
        <Badge label="Needs some site work" />
        <Badge label="Needs Extensive site work" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">How wet is the property?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge select label="Wet" />
        <Badge label="Some portions wet" />
        <Badge label="Not wet" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">Property have Restrictions?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge select label="Has restrictions" />
        <Badge label="No restrictions" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">How is the access to the property?</p>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge label="Road frontage" />
        <Badge label="Legal easement" />
        <Badge select label="Non-recorded easement" />
        <Badge label="No legal access" />
      </div>
    </div>
    <div>
      <p className="mb-4 text-grey-500 font-semibold text-lg">Please estimate a value for any improvements. Sheds, Barns, Well installed, etc.</p>
      <TextField value="$150,000" />
    </div>
    <Button classNames="mt-4 md:w-fit">Find out Your Estimated Sale Price</Button>
  </div>
);

export default PropertyAbout;
