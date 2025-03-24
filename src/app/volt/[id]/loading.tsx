import { LoadingIcon2 } from "@/components/@new/icons/LoadingIcons";

const Loading = () => (
  <div className="fixed z-[99] w-full h-full top-0 left-0 bg-black-1000/40 flex items-center justify-center">
    <div className="rounded-2xl bg-white p-6 shadow-3 space-y-4 max-w-[90%] lg:max-w-lg">
      <div className="relative w-fit mx-auto">
        <svg
          className="absolute -top-[-50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
          width="21"
          height="24"
          viewBox="0 0 21 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.1721 8.10277L11.3736 1.47938C11.5124 0.711291 10.9417 0 10.1852 0H1.20935C0.54185 0 0 0.559838 0 1.24949V7.24002C0 7.89182 0.484262 8.43543 1.11511 8.48411L8.8921 9.11697C9.50725 9.16835 10.0622 8.73022 10.1747 8.10277H10.1721Z"
            fill="#0E8B40"
          />
          <path
            d="M17.282 0H15.2586C14.6775 0 14.1775 0.427316 14.0702 1.0169L11.2562 16.5247C11.1175 17.2928 11.6881 18.0041 12.4446 18.0041H17.282C18.9756 18.0041 20.3473 16.5869 20.3473 14.837V3.167C20.3473 1.41717 18.9756 0 17.282 0Z"
            fill="#16DB65"
          />
          <path
            d="M8.15655 11.7192L1.30358 11.1621C0.599438 11.1053 0 11.6787 0 12.4062V22.5238C0 23.2135 0.54185 23.7733 1.20935 23.7733H6.32682C6.90794 23.7733 7.4079 23.346 7.51523 22.7537L9.25072 13.1905C9.38422 12.4603 8.87378 11.7733 8.15655 11.7138V11.7192Z"
            fill="#05471C"
          />
        </svg>
        <LoadingIcon2 className="animate-spin size-12 text-primary-main" />
      </div>
      <p className="text-grey-800 text-center ">
        Fetching comparable lands sold within a <span className="font-bold">10-mile</span> radius
      </p>
    </div>
  </div>
);

export default Loading;
