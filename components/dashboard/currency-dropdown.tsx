'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useCurrency } from '@/Providers/currency-provider'
import { Button } from '../ui/button'
import Cookies from 'js-cookie'
const CurrencyDropdown = () => {
    const {currency,setCurrency} = useCurrency()
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant='ghost'>{currency}</Button></DropdownMenuTrigger>
        <DropdownMenuContent>

            <DropdownMenuItem onClick={()=>{setCurrency('USD')}}>USD</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{setCurrency('INR')}}>INR</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CurrencyDropdown