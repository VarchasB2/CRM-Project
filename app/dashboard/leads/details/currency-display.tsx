"use client";
import { useCurrency } from "@/Providers/currency-provider";
import React from "react";

const CurrrencyDisplay = ({revenue}:{revenue:any}) => {
  const { currency,convertFromUSD } = useCurrency();
  const revenueInSelectedCurrency = currency === 'INR' ? convertFromUSD(revenue) : revenue;
  const currencySymbol = currency === 'INR'? `\u20B9` : '$'
  return <div>{`Revenue: ${currencySymbol} ${revenueInSelectedCurrency.toLocaleString('en-In')}`}</div>;
};

export default CurrrencyDisplay;
