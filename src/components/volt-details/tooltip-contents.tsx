export const AvgDescription = () => (
  <ul className="py-3 flex flex-col gap-2">
    <li className="text-black text-start text-xs px-4">
      <span className="font-bold">Avg (Estimated Parcel Price):</span> Represents the estimated value of the subject parcel based on recent
      sales. It is calculated by multiplying the Average PPA by the subject parcel’s acreage.
    </li>
    <li className="text-black text-start text-xs px-4">
      <span className="font-bold">Average PPA (Price Per Acre):</span> This is determined by dividing the total sum of all parcel prices per
      acre by the number of parcels.
    </li>
    <div className="space-y-1">
      <p className="text-black text-start text-xs  px-4 font-bold">Formula:</p>
      <li className="text-black text-start text-xs  px-4 ml-6">
        📌 <span className="font-bold pl-1">Average PPA</span> = (Total sum of all parcel prices per acre) ÷ (Number of parcels)
      </li>
      <li className="text-black text-start text-xs  px-4 ml-6">
        📌 <span className="font-bold pl-1">Avg (Parcel Price Estimate) </span> = Average PPA × Subject Parcel Acreage
      </li>
    </div>
    <li className="text-black text-start text-xs px-4">
      It is calculated if there are at least <span className="font-bold">2 parcels.</span>
    </li>
  </ul>
);

export const VoltDescription = () => (
  <ul className="py-3 flex flex-col gap-2">
    <li className="text-black text-start text-xs px-4">
      <span className="font-bold">VOLT (Estimated Parcel Price):</span> Represents the estimated value of the subject parcel, based on
      recent sales. It is calculated by multiplying the VOLT PPA by the subject parcel’s acreage.
    </li>
    <div className="space-y-1">
      <p className="text-black text-start text-xs px-4 font-bold">Formula:</p>
      <li className="text-black text-start text-xs px-4 ml-6">
        📌 <span className="font-bold pl-1">VOLT (Estimated Parcel Price) </span> = VOLT PPA × Subject Parcel Acreage
      </li>
    </div>
    <li className="text-black text-start text-xs px-4">
      <span className="font-bold">VOLT PPA (Price Per Acre):</span> Represents the average price per acre, calculated only from selected
      parcels that meet specific criteria for inclusion.
    </li>
    <div className="space-y-1">
      <p className="text-black text-start text-xs  px-4 font-bold">Parcel Color Indicators:</p>
      <li className="text-black text-start text-xs px-4 ml-6 flex items-center gap-2">
        <div className="min-w-4 min-h-4 size-4 rounded-full bg-[#FF2F48]" /> <span className="font-bold pl-1 w-max">Red Parcels </span> -
        Included in the VOLT PPA calculation.
      </li>
      <li className="text-black text-start text-xs px-4 ml-6 flex items-center gap-2">
        <div className="min-w-4 min-h-4 size-4 rounded-full bg-warning" /> <span className="font-bold pl-1">Yellow Parcels </span> -
        Excluded from the VOLT PPA calculation.
      </li>
    </div>
    <div className="space-y-1">
      <p className="text-black text-start text-xs px-4 font-bold">Formula:</p>
      <li className="text-black text-start text-xs px-4 ml-6">
        📌 <span className="font-bold pl-1">VOLT PPA </span> = (Total sum of red parcel prices per acre) ÷ (Number of red parcels)
      </li>
    </div>
    <li className="text-black text-start text-xs px-4">
      This method ensures a <span className="font-bold">more accurate and relevant price per acre</span> by filtering out parcels that could
      distort the valuation.
    </li>
    <li className="text-black text-start text-xs px-4">
      It is calculated if there are at least <span className="font-bold">3 parcels.</span>
    </li>
  </ul>
);

export const AvgPpaDescription = () => (
  <ul className="py-3 flex flex-col gap-2">
    <li className="text-black text-start text-xs px-4">
      <span className="font-bold">Average PPA (Price Per Acre)</span> Is calculated by dividing the total sum of all parcel prices per acre
      by the number of parcels
    </li>
    <div className="space-y-1">
      <p className="text-black text-start text-xs px-4 font-bold">Formula:</p>
      <li className="text-black text-start text-xs px-4 ml-6">
        📌 <span className="font-bold pl-1 w-max">Average PPA </span> = (Total sum of all parcel prices per acre) ÷ (Number of parcels)
      </li>
    </div>
    <li className="text-black text-start text-xs px-4">
      It is calculated if there are at least <span className="font-bold">2 parcels.</span>
    </li>
  </ul>
);

export const VoltPpaDescription = () => (
  <ul className="py-3 flex flex-col gap-2">
    <li className="text-black text-start text-xs px-4">
      <span className="font-bold">VOLT PPA (Price Per Acre):</span> Represents the average price per acre based only on selected parcels
      that meet the criteria for calculation.
    </li>
    <div className="space-y-1">
      <p className="text-black text-start text-xs  px-4 font-bold">Parcel Color Indicators:</p>
      <li className="text-black text-start text-xs px-4 ml-6 flex items-center gap-2">
        <div className="min-w-4 min-h-4 size-4 rounded-full bg-[#FF2F48]" /> <span className="font-bold pl-1 w-max">Red Parcels </span> -
        Included in the VOLT PPA calculation.
      </li>
      <li className="text-black text-start text-xs px-4 ml-6 flex items-center gap-2">
        <div className="min-w-4 min-h-4 size-4 rounded-full bg-warning" /> <span className="font-bold pl-1">Yellow Parcels </span> -
        Excluded from the VOLT PPA calculation.
      </li>
    </div>
    <div className="space-y-1">
      <p className="text-black text-start text-xs px-4 font-bold">Formula:</p>
      <div>
        <li className="text-black text-start text-xs px-4 ml-6">
          📌 <span className="font-bold pl-1 w-max">VOLT PPA </span> = (Total sum of red parcel prices per acre) ÷ (Number of red parcels)
        </li>
        <li className="text-black text-start text-xs px-4 ml-12">
          This ensures a more <span className="font-bold pl-1">accurate and relevant</span> price per acre by filtering out parcels that may
          skew the results.
        </li>{" "}
      </div>
    </div>
    <li className="text-black text-start text-xs px-4">
      It is calculated if there are at least <span className="font-bold">3 parcels.</span>
    </li>
    <li className="text-black text-start text-xs px-4">
      Make sure you’ve{" "}
      <span className="font-bold">turned on the VOLT switcher in the top right corner to view which parcels are excluded</span> from the
      price calculation. <span className="font-bold">Yellow parcels</span> are excluded, while{" "}
      <span className="font-bold">red parcels</span> are included in the VOLT PPA calculation.
    </li>
  </ul>
);
