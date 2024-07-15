import React from 'react'
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
// async function loadCSV(filename: string): Promise<any[]> {
//   const records: any[] = [];
//   const filePath = path.resolve(__dirname, filename);
//   const parser = fs.createReadStream(filePath).pipe(parse({ columns: true }));
//   for await (const record of parser) {
//     records.push(record);
//   }
//   return records;
// }

const Dashboard = () => {
  // const data = await loadCSV('c:/Users/scl/Downloads/PowerQuery Working - 2.csv')
  // console.log('DATA',data[0])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard