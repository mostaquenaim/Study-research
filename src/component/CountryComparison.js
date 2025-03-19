'use client'
import { useEffect, useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CountryComparison() {
    const [countries, setCountries] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await fetch('/countries.json');
        const data = await response.json();
        setCountries(data);
    };

    const columns = useMemo(() => {
        if (countries?.countries && countries.countries.length > 0) {
            return Object.keys(countries.countries[0])
                .filter((key) => key !== "name")
                .map((key) => ({
                    header: key.replace(/_/g, " ").toUpperCase(),
                    accessorKey: key,
                }));
        }
        return [];
    }, [countries]);

    const table = useReactTable({
        columns: [{ header: "Country", accessorKey: "name" }, ...columns],
        data: countries?.countries || [],
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <motion.h1
                className="text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Country Comparison Table
            </motion.h1>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-lg">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-gray-200">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="p-4 border text-left text-sm font-semibold text-black">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row, index) => (
                            <motion.tr
                                key={row.id}
                                className={`border ${index % 2 ? "bg-gray-50" : "bg-white"}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {row.getVisibleCells().map((cell, idx) => {
                                    // If the column is for the country name, render the flag
                                    if (cell.column.id === 'name') {
                                        const countryCode = row.original.code || row.original.name.slice(0, 2).toUpperCase(); // Assuming 'code' or first two letters of name as code
                                        return (
                                            <td key={cell.id} className="p-4 border font-semibold text-sm text-black flex items-center">
                                                <Image
                                                    src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
                                                    alt={countryCode}
                                                    width={10}
                                                    height={10}
                                                    className="w-6 h-4 mr-2"
                                                />
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    }
                                    return (
                                        <td key={cell.id} className={`${(index + idx) % 2 && 'bg-gray-300'} p-4 border text-sm text-black`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
