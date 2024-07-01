'use client'
import { useCurrency } from "@/Providers/currency-provider";
import { revenue } from "./columns";

const RevenueColumn = ({ row }: { row: any }) => {
    const { currency, convertToUSD, convertFromUSD } = useCurrency(); // Access currency context
    console.log('REVENUE',Number(row.getValue('revenue')))
    // Convert revenue to the selected currency
    const revenueInSelectedCurrency = currency === 'INR' ? convertFromUSD(Number(row.getValue('revenue'))) : Number(row.getValue('revenue'));
    const currencySymbol = currency === 'INR'? `\u20B9` : '$'
    return (
      <span>{`${currencySymbol} ${revenueInSelectedCurrency.toLocaleString('en-In')}`}</span> // Format the number as needed
    );
  };

  export default RevenueColumn