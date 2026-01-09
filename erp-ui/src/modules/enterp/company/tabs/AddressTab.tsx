import { useEffect, useState } from "react";
import axios from "axios";

interface Company {
  company: string;
  name: string;
  creation_date: string;
  association_no?: string;
  default_language: string;
  logotype?: string;
  corporate_form?: string;
  country: string;
  created_by: string;
  localization_country: string;
  rowversion: number;
  rowkey: string;
}

export default function GeneralTab() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios.get("/api/company").then(res => setCompanies(res.data));
  }, []);

  return (
    <div>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Company</th>
            <th>Name</th>
            <th>Country</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.company}>
              <td>{c.company}</td>
              <td>{c.name}</td>
              <td>{c.country}</td>
              <td>{c.created_by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}