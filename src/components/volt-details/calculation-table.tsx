"use client";

const HEADERS = ["Parcel ID", "County", "Acrage", "Sold Price", "Price per acre", "Last sale date"];

const VoltDetailsCalculationTable = () => {
  console.log("ae");

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            {HEADERS.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>January</td>
            <td>$100</td>
          </tr>
          <tr>
            <td>February</td>
            <td>$80</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Sum</td>
            <td>$180</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default VoltDetailsCalculationTable;
