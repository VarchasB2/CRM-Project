import React, { createContext } from "react";

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
  const [currency, setCurrency] = React.useState("USD");
  const exchangeRates: Record<string, number> = {
    USD: 1,
    INR: 83.56,
  };
  //   const convertCurrency = (amount: number, targetCurrency: string): number => {
  //     if (currency === targetCurrency) {
  //       return amount;
  //     }
  //     const rate = exchangeRates[targetCurrency] / exchangeRates[currency];
  //     return amount * rate;
  //   };
  const convertToUSD = (amount: number): number => {
    return amount / exchangeRates[currency];
  };

  const convertFromUSD = (amount: number): number => {
    return amount * exchangeRates[currency];
  };
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
