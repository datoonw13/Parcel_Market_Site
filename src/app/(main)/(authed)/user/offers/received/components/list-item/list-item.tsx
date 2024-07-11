import React, { FC } from 'react'
import { OfferModel } from '@/types/offer';
import classes from './list-item.module.css'
import clsx from 'clsx';
import { LocationIcon1 } from '@/components/@new/icons/LocationIcons';
import { getCountyValue, getStateValue } from '@/helpers/states';
import Divider from '@/components/@new/shared/Divider';
import Button from '@/components/@new/shared/forms/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import routes from '@/helpers/routes';
import { numFormatter } from '@/helpers/common';
import ReceivedOfferDetailSection from '../../../components/offer-detail-section';

interface ReceivedOfferListItemProps {
    data: OfferModel;
    selecting: boolean;
    selected: boolean;
    toggleSelect: (offerId: number) => void;
    openDetail: (offer: OfferModel) => void;
}

const ReceivedOfferListItem: FC<ReceivedOfferListItemProps> = ({data, openDetail, selected, selecting, toggleSelect}) => {
    const { push } = useRouter();
    const searchParams = useSearchParams();

  return (
    <div className={clsx(classes.root, selected && classes.selected, selecting && classes.selecting)} onClick={() => toggleSelect(data.id)}>
    <div className="flex flex-col sm:flex-row gap-9 px-4 md:px-8 mb-3 sm:mb-4">
      <div className="space-y-2 grid">
        <h1 className="font-semibold text-white truncate max-w-[80%] sm:max-w-[40%] md:sm:max-w-[50%] lg:max-w-[calc(100%-160px)] sm:text-black sm:text-lg">
          long names with 3 dots long names with 3 dot long names with 3 dot...
        </h1>
        <div className="flex items-center gap-1.5">
          <LocationIcon1 color="white" className="w-3 h-3.5 fill-white sm:fill-grey-600" />
          <h6 className="text-xs text-white sm:text-grey-600">
            {getStateValue(data.sellingProperty.state)?.label};{" "}
            {getCountyValue(data.sellingProperty.county, data.sellingProperty.state)?.label}
          </h6>
        </div>
      </div>
      <div className="flex justify-between sm:flex-col sm:justify-start items-center">
        <p className="text-xs font-medium sm:text-white sm:ml-auto">Offered Price</p>
        <p className="font-semibold text-primary-main sm:text-white sm:text-2xl">{numFormatter.format(Number(data.price))}</p>
      </div>
    </div>
    <ReceivedOfferDetailSection data={data} rootClasses="mx-4 md:mx-8 mb-8" alertClasses='mt-3' />
    <Divider className="mb-4" />
    <div className="flex gap-3 px-4 md:px-8">
      <Button className="w-full sm:w-fit !h-10 sm:!h-auto sm:mr-auto" variant="secondary">
        Contact Buyer
      </Button>
      <Button
        className="hidden sm:block w-full sm:w-fit !h-10 sm:!h-auto"
        variant="secondary"
        onClick={() => {
          push(`/${routes.landsMarketplace.url}/${data.sellingPropertyId}`);
        }}
      >
        View Land
      </Button>
      <Button className="w-full sm:w-fit !h-10 sm:!h-auto" onClick={() => openDetail(data)}>
        Details
      </Button>
    </div>
  </div>
  )
}

export default ReceivedOfferListItem