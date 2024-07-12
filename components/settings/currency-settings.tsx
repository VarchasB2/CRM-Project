"use client";
import React from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const fetchCurrency = async ()=>{
    const currentRate = await (await fetch('/api/currency',{method:'GET'})).json()
    // console.log('FETCH RATE',currentRate)
    return currentRate.rate
  }
  const handleClick = async () =>{
    const response = await fetch('/api/currency-conversion',{method:'GET'}) 
    window.location.reload();
  }
const CurrencySettings = () => {
  const [currentRate, setCurrentRate] = React.useState<number | null>(null);
  React.useEffect(() => {
    const fetchData = async () => {
      const rate = await fetchCurrency();
      setCurrentRate(rate);
    };
    fetchData();
  }, []);
  return (
    <TabsContent value="currency">
      <Card className="p-4 w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription className="pb-4">
            Generate latest currency exhange rate
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="flex flex-row gap-2">
          <Button onClick={handleClick}>Generate</Button>
          <Input disabled value={String(currentRate)} />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default CurrencySettings;
