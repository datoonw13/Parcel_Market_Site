import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ResponsiveModal from "@/components/ui/dialogs/responsive-dialog";
import { MinmaxDropdownContent } from "@/components/ui/minmax-dropdown";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAllStates, getCounties } from "@/helpers/states";
import { cn, parseSearchParams, updateSearchParamsWithFilters } from "@/lib/utils";
import { userRecentSearchesValidations } from "@/zod-validations/filters-validations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TbFilter } from "react-icons/tb";
import { z } from "zod";

const RecentSearchesMobileFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<typeof filters>(null);
  const filters = useMemo(() => parseSearchParams(userRecentSearchesValidations, searchParams), [searchParams]);
  const states = useMemo(() => getAllStates({ filterBlackList: true }).map(({ counties, ...rest }) => rest), []);
  const counties = useMemo(() => (filters?.state ? getCounties(filters.state) : []), [filters?.state]);

  const changeLocalFilter = <T extends keyof z.infer<typeof userRecentSearchesValidations>>(
    data: Array<{
      key: T;
      value?: z.infer<typeof userRecentSearchesValidations>[T] | null;
      resetKey?: T;
    }>
  ) => {
    if (!values) {
      return;
    }
    const newValues = { ...values };
    data.forEach((item) => {
      if (item.value || item.value === 0) {
        newValues[item.key] = item.value;
      } else {
        delete newValues[item.key];
      }
      if (item.resetKey) {
        delete newValues[item.resetKey];
      }
    });
    setValues({ ...newValues });
  };

  const voltPriceError = !!(
    typeof values?.voltPriceMin === "number" &&
    typeof values.voltPriceMax === "number" &&
    values?.voltPriceMin >= values.voltPriceMax
  );

  const acreageError = !!(
    typeof values?.acreageMin === "number" &&
    typeof values.acreageMax === "number" &&
    values?.acreageMin >= values.acreageMax
  );

  const disableOkButton = voltPriceError || acreageError || JSON.stringify(values) === JSON.stringify(filters);

  useEffect(() => {
    if (filters && !values) {
      setValues(filters);
    }
  }, [filters, values]);

  return (
    values && (
      <>
        <ResponsiveModal
          dialogContentClassName="max-w-2xl w-full"
          open={open}
          closeModal={() => {
            setOpen(false);
            setValues(filters);
          }}
        >
          <div className="bg-white md:shadow-4 h-[80vh] w-full overflow-y-auto overflow-x-hidden flex rounded-lg flex-col ">
            <div className="flex justify-between gap-3 w-full items-center px-5 md:px-8 md:border-b md:border-b-grey-100 py-4 md:py-6 md:sticky md:top-0 md:bg-white">
              <h1 className="text-lg font-semibold">Filters</h1>
              <IoMdClose
                className="text-grey-800 cursor-pointer p-2 size-8"
                onClick={() => {
                  setOpen(false);
                  setValues(filters);
                }}
              />
            </div>
            <Accordion type="single" collapsible className="w-full px-5 md:px-8">
              <AccordionItem value="states">
                <AccordionTrigger>State</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    onValueChange={(value) => changeLocalFilter([{ key: "state", value, resetKey: "county" }])}
                    value={values?.state || ""}
                    className=""
                  >
                    {states.map((state) => (
                      <RadioGroupItem key={state.value} value={state.value} label={state.label} />
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                disabled={!values?.state}
                className="data-[disabled]:opacity-60 data-[disabled]:cursor-not-allowed"
                value="counties"
              >
                <AccordionTrigger>Counties</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    onValueChange={(value) => changeLocalFilter([{ key: "county", value }])}
                    value={values?.county || ""}
                    className=""
                  >
                    {counties.map((state) => (
                      <RadioGroupItem key={state.value} value={state.value} label={state.label} />
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="acreage">
                <AccordionTrigger>Acreage</AccordionTrigger>
                <AccordionContent>
                  <MinmaxDropdownContent
                    error={acreageError}
                    disablePadding
                    value={{
                      min: values.acreageMin === null ? null : values.acreageMin,
                      max: values.acreageMax === null ? null : values.acreageMax,
                    }}
                    renderOption={(value) => {
                      if (value?.min && !value?.max) {
                        return `${value.min - 1}+ Acres`;
                      }
                      if (!value?.min && value?.max) {
                        return `${value.max - 1}+ Acres`;
                      }
                      return "";
                    }}
                    onInputChange={(value) => {
                      changeLocalFilter([
                        {
                          key: "acreageMin",
                          value: value.min,
                        },
                        {
                          key: "acreageMax",
                          value: value.max,
                        },
                      ]);
                    }}
                    data={[
                      {
                        min: 1,
                        max: null,
                      },
                      {
                        min: 6,
                        max: null,
                      },
                      {
                        min: 11,
                        max: null,
                      },
                      {
                        min: 21,
                        max: null,
                      },
                      {
                        min: 51,
                        max: null,
                      },
                    ]}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="voltPrice">
                <AccordionTrigger>VOLT Price</AccordionTrigger>
                <AccordionContent>
                  <MinmaxDropdownContent
                    error={voltPriceError}
                    disablePadding
                    inputPrefix="$"
                    value={{
                      min: values.voltPriceMin === null ? null : values.voltPriceMin,
                      max: values.voltPriceMax === null ? null : values.voltPriceMax,
                    }}
                    renderOption={(val) => {
                      if (val?.min && val?.max) {
                        return `$${val.min} - ${val.max}`;
                      }
                      if (val?.min && !val?.max) {
                        return `$${val.min} - N/A`;
                      }
                      if (!val?.min && val?.max) {
                        return `$0 - $${val.max}`;
                      }
                      return "";
                    }}
                    onInputChange={(val) => {
                      changeLocalFilter([
                        {
                          key: "voltPriceMin",
                          value: val.min,
                        },
                        {
                          key: "voltPriceMax",
                          value: val.max,
                        },
                      ]);
                    }}
                    data={[
                      {
                        min: null,
                        max: 50000,
                      },
                      {
                        min: 50000,
                        max: 100000,
                      },
                      {
                        min: 100000,
                        max: 200000,
                      },
                      {
                        min: 200000,
                        max: 500000,
                      },
                      {
                        min: 500000,
                        max: null,
                      },
                    ]}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-col-reverse md:justify-end md:flex-row gap-3 w-full sticky bottom-0 bg-white mt-auto py-4 md:py-6 px-5 md:px-8">
              <Button
                className="w-full md:w-fit"
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setValues(filters);
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-full md:w-fit"
                disabled={disableOkButton}
                onClick={() => {
                  try {
                    const res = userRecentSearchesValidations.parse(values);
                    const data: any = Object.entries(res).reduce(
                      (
                        acc: Array<{
                          key: string;
                          value?: string | number | null;
                          resetKey?: string;
                        }>,
                        cur
                      ) => [...acc, { key: cur[0], value: cur[1] }],
                      []
                    );
                    const newSearchParams = updateSearchParamsWithFilters(data, searchParams.toString());
                    router.push(`${pathname}?${newSearchParams.toString()}`);
                  } catch (error) {}
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </ResponsiveModal>
        <div className="2xl:hidden ml-auto">
          <Button
            className={cn("p-2.5 h-fit !bg-transparent text-grey-800 border border-grey-100 !rounded-xl")}
            onClick={() => setOpen(true)}
          >
            <div className="flex gap-2 items-center">
              <TbFilter className="size-5" style={{ transform: "scale(-1, 1)" }} />
              <span className="hidden md:block text-grey-600">Filter</span>
            </div>
          </Button>
        </div>
      </>
    )
  );
};

export default RecentSearchesMobileFilters;
