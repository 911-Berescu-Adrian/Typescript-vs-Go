import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";
import CdCard, { CdType } from "../components/CdCard";
import { Link } from "react-router-dom";
import LuckyButton from "../components/LuckyButton";

export default function CdList() {
    const [cds, setCds] = useState([]);

    async function fetchCds() {
        const response = await fetch(BACKEND_URL + "/api/cds");
        const data = await response.json();
        setCds(data);
    }

    useEffect(() => {
        fetchCds();
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold tracking-wide mt-4">CDs Marketplace</h1>
            <div className="flex justify-center gap-4 mb-10">
                <Link
                    to="/add"
                    className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white transition bg-indigo-600 rounded-lg shadow ripple hover:shadow-lg hover:bg-indigo-800 focus:outline-none mt-10"
                >
                    Add a new CD
                </Link>
                <LuckyButton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cds.map((cd: CdType) => (
                    <CdCard key={cd.id} cd={cd} />
                ))}
            </div>
        </>
    );
}
