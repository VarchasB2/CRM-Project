import React, { createContext } from "react";
import Cookies from 'js-cookie'
interface CurrencyContextType {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  //   convertCurrency: (amount: number, targetCurrency: string) => number;
  convertToUSD: (amount: number) => number;
  convertFromUSD: (amount: number) => number;
}
export const CurrencyContext = React.createContext<
  CurrencyContextType | undefined
>(undefined);

export const CurrencyProvider = ({ children }: any) => {
  const initialCurrency = Cookies.get("currency") || "USD"
  const [currency, setCurrency] = React.useState("USD");
  const exchangeRates: Record<string, number> = {
    USD: 1,
    INR: 83.45,
  };
  //   const convertCurrency = (amount: number, targetCurrency: string): number => {
  //     if (currency === targetCurrency) {
  //       return amount;
  //     }
  //     const rate = exchangeRates[targetCurrency] / exchangeRates[currency];
  //     return amount * rate;
  //   };
  const convertToUSD = (amount: number): number => {
    return amount / exchangeRates['INR'];
  };

  const convertFromUSD = (amount: number): number => {
    return amount * exchangeRates['INR'];
  };
  React.useEffect(() => {
    Cookies.set("currency", currency, { expires: 365 }); // Update or set cookie with the currency value
  }, [currency]);
  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertToUSD, convertFromUSD }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
export const useCurrency = () => {
  const context = React.useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
