import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const ImportCsv = () => {
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const { data: session } = useSession();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv") {
        setFile(selectedFile);
        // Further processing can be done here
        console.log("File selected:", selectedFile.name);
      } else {
        alert("Please select a CSV file.");
      }
    }
  };
  const handleUpload = async () => {
    if (!file) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Read the contents of the file
      const fileContent = await file.text();
      // Split the CSV content by lines
      // console.log(fileContent)
      const lines = fileContent.split(/\r?\n/);

      // Assuming the first line contains headers/column names
      const headers = lines[0].split(",");
      // console.log(headers)
      // Prepare data array to hold parsed CSV rows
      const data = [];

      // Process each line (skipping the header line)
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        //   console.log(values,headers)
        if (values.length === headers.length) {
          // Create an object with headers as keys and values as values
          const row: any = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index].trim();
          });
          data.push(row);
        }
      }
      const response = await fetch("/api/csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, session: session }),
      });

      if (response.ok) {
        toast({
            title:'File imported successfully'
        })
      } else {
        toast({
            title:'File import failed',
            variant:'destructive'
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title:'Error importing file',
        variant:'destructive'
    })
    }finally{
        setTimeout(() => {
            window.location.reload();
          }, 2000);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <FileDown className="w-4 h-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription className="leading-loose">
            Please make sure the CSV follows the following rules:
            <br />
            {"1. Date needs to be formatted as yyyy-mm-dd"}
            <br />
            {"2. Country names need to be as specified here:"}
            <br />
            <a href="https://github.com/datasets/country-list/blob/master/data.csv">
              https://github.com/datasets/country-list/blob/master/data.csv
            </a>
            <br />
            {
              "3. Revenue must not have any commas and should be in dollars(no dollar sign)"
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-2">
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={!file}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCsv;
