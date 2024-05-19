import { Link } from "react-router-dom";

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function LuckyButton() {
    return (
        <Link
            to={"/details/" + getRandomNumber(4, 11)}
            className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center  transition bg-slate-50 border border-slate-200 rounded-lg shadow ripple hover:shadow-lg hover:bg-slate-300 focus:outline-none mt-10"
        >
            Feeling Lucky
        </Link>
    );
}
