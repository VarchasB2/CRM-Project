import SettingsTabs from "@/components/settings/setttings-tabs";
import React from "react";

const Settings = ({searchParams}:{searchParams:any}) => {
  return (
    <div className="flex flex-1 items-center gap-4 p-4 sm:px-6 sm:py-20 md:gap-8 2xl:justify-center">
      <SettingsTabs searchParams={searchParams}/>
    </div>
  );
};

export default Settings;
