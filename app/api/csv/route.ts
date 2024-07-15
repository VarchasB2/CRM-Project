import React from 'react'
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import formidable from 'formidable';
import db from '@/app/modules/db';

export async function POST(req:Request){
    const {data:obj,session} = await req.json()
    const promises = obj.map(async (item: any) => {
        const leadData: any = {
            date: new Date(item['Date']),
            type_of_company: item['Type of Company'],
            funnel_stage: item['Funnel Stage'],
            company_name: item['Company Name'],
            region: item['Region'],
            country: item['Country'],
            lead_owner: {
                connectOrCreate: {
                    where: {
                        name: item['Lead Owner']
                    },
                    create: {
                        name: item['Lead Owner'],
                        email: `${item['Lead Owner']}@mail.com`,
                        pwd: 'user1234',
                        image: 'https://kfxchmygpjswwnrxkxki.supabase.co/storage/v1/object/public/images/1720878037246-pexels-jcosta-18455521.jpg',
                        role: 'user'
                    }
                }
            },
            contacts: {
                connectOrCreate: {
                    where: { email: item['Email ID'] },
                    create: {
                        first_name: item['Contact First Name'],
                        last_name: item['Contact Last Name'],
                        designation: item['Designation'],
                        email: item['Email ID'],
                        phone_number: item['Phone Number']
                    }
                }
            },
            history: {
                create: {
                    crud: 'Create',
                    changes: 'Imported values from CSV',
                    user: session.user.username
                }
            }
        };

        if (item['Revenue'] && item['Revenue'].trim() !== '') {
            leadData.account = {
                create: {
                    date: new Date(item['Date']),
                    type_of_company: item['Type of Company'],
                    funnel_stage: item['Funnel Stage'],
                    company_name: item['Company Name'],
                    region: item['Region'],
                    country: item['Country'],
                    contacts: {
                        connectOrCreate: {
                            where: { email: item['Email ID'] },
                            create: {
                                first_name: item['Contact First Name'],
                                last_name: item['Contact Last Name'],
                                designation: item['Designation'],
                                email: item['Email ID'],
                                phone_number: item['Phone Number']
                            }
                        }
                    },
                    opportunities: {
                        create: {
                            revenue: parseInt(item['Revenue']),
                            contact: {
                                connect: {
                                    email: item['Email ID']
                                }
                            }
                        }
                    }
                }
            };
        }

        const result = await db.leads.create({
            data: leadData
        });

        return result;
    });

    const results = await Promise.all(promises);
    
    return Response.json(results)
}