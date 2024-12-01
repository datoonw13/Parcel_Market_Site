import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ResponsiveModal from "@/components/ui/dialogs/responsive-dialog";
import { MinmaxDropdownContent } from "@/components/ui/minmax-dropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllStates, getCounties } from "@/helpers/states";
import { cn, parseSearchParams, updateSearchParamsWithFilters } from "@/lib/utils";
import { userSearchesValidations } from "@/zod-validations/filters-validations";
import { uniqBy } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TransitionStartFunction, useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TbFilter } from "react-icons/tb";
import { z } from "zod";

const sortMultiSelectOptions = (options: { label: string; value: string }[], selectedValues: string[]) => {
  const checkedOptions = options.filter((el) => selectedValues.find((x) => x === el.value));
  const uncheckedOptions = options.filter((el) => !selectedValues.find((x) => x === el.value));
  return [...checkedOptions, ...uncheckedOptions];
};

const SearchesMobileFilters = ({ startTransition }: { startTransition: TransitionStartFunction }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<typeof filters>(null);
  const filters = useMemo(() => parseSearchParams(userSearchesValidations, searchParams), [searchParams]);
  const states = useMemo(() => getAllStates({ filterBlackList: true }).map(({ counties, ...rest }) => rest), []);
  const counties = useMemo(() => {
    const countiesList =
      values?.states
        ?.split(",")
        .map((state) => getCounties(state).map((x) => ({ ...x, label: `${x.label}(${state.toLocaleUpperCase()})` }))) || [];
    return uniqBy(countiesList.flat(), "value");
  }, [values?.states]);

  const changeLocalFilter = <T extends keyof z.infer<typeof userSearchesValidations>>(
    data: Array<{
      key: T;
      value?: z.infer<typeof userSearchesValidations>[T] | null;
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

  const totalFiltersSelected = filters
    ? Object.keys(filters)
        .filter((key) => filters[key as keyof typeof filters])
        .filter((el) => el !== "search")
        .filter((el) => el !== "sortBy")
        .filter((el) => el !== "page").length
    : 0;

  useEffect(() => {
    if (filters && !values) {
      setValues(filters);
    }
  }, [filters, values]);

  return (
    values && (
      <>
        <ResponsiveModal
          mediaQuery="lg"
          dialogContentClassName="max-w-2xl w-full"
          open={open}
          closeModal={() => {
            setOpen(false);
            setValues(filters);
          }}
        >
          <div className="bg-white lg:shadow-4 h-[80vh] w-full overflow-y-auto overflow-x-hidden flex rounded-lg flex-col ">
            <div className="flex justify-between gap-3 w-full items-center px-5 lg:px-8 lg:border-b lg:border-b-grey-100 py-4 lg:py-6 lg:sticky lg:top-0 lg:bg-white">
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
                <AccordionContent className="space-y-3">
                  {sortMultiSelectOptions(states, filters?.states?.split(",") || []).map((state) => (
                    <Checkbox
                      id={state.value}
                      key={state.value}
                      value={state.value}
                      label={state.label}
                      checked={values.states ? values.states.split(",").includes(state.value) : false}
                      onClick={(e) => {
                        let newValues = values?.states?.split(",") || [];

                        if (newValues.includes(state.value)) {
                          newValues = newValues.filter((el) => el !== state.value);
                        } else {
                          newValues = [...newValues, state.value];
                        }
                        setValues({ ...values, states: newValues.join(",") });
                      }}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                disabled={!values?.states}
                className="data-[disabled]:opacity-60 data-[disabled]:cursor-not-allowed"
                value="counties"
              >
                <AccordionTrigger>Counties</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {sortMultiSelectOptions(counties, filters?.counties?.split(",") || []).map((county) => (
                    <Checkbox
                      id={county.value}
                      key={county.value}
                      value={county.value}
                      label={county.label}
                      checked={values.counties ? values.counties.split(",").includes(county.value) : false}
                      onClick={(e) => {
                        let newValues = values?.counties?.split(",") || [];

                        if (newValues.includes(county.value)) {
                          newValues = newValues.filter((el) => el !== county.value);
                        } else {
                          newValues = [...newValues, county.value];
                        }
                        setValues({ ...values, counties: newValues.join(",") });
                      }}
                    />
                  ))}
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
            <div className="flex flex-col-reverse  gap-3 w-full sticky bottom-0 bg-white mt-auto py-4 md:py-6 px-5 md:px-8">
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setValues(filters);
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                disabled={disableOkButton}
                onClick={() => {
                  try {
                    const res = userSearchesValidations.parse(values);
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
                    const resetPage = { key: "page" as const, value: 1 };
                    const newSearchParams = updateSearchParamsWithFilters([...data, resetPage], searchParams.toString());
                    startTransition(() => {
                      router.push(`${pathname}?${newSearchParams.toString()}`);
                    });
                  } catch (error) {}
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </ResponsiveModal>
        <div className="lg:hidden ml-auto">
          <Button
            className={cn(
              "p-2.5 h-fit !bg-transparent text-grey-800 border border-grey-100 !rounded-xl relative",
              totalFiltersSelected &&
                `border-primary-main !bg-primary-main-100 text-primary-main 
              after:content-[attr(after-dynamic-value)] after:absolute after:bg-error after:rounded-full after:text-white after:size-5 after:text-xs after:right-0 after:top-0 after:translate-x-1/2 after:-translate-y-1/2`
            )}
            after-dynamic-value={totalFiltersSelected}
            onClick={() => setOpen(true)}
          >
            <div className="flex gap-2 items-center">
              <TbFilter className="size-5" style={{ transform: "scale(-1, 1)" }} />
            </div>
          </Button>
        </div>
      </>
    )
  );
};

export default SearchesMobileFilters;
