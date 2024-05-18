import http from "k6/http";
import { sleep } from "k6";

export let options = {
    stages: [
        { duration: "30s", target: 10 }, // Ramp-up to 10 users
        { duration: "1m", target: 100 }, // Stay at 10 users
        { duration: "10s", target: 0 }, // Ramp-down to 0 users
    ],
    ext: {
        output: ["json=output.json", "prometheus=http://localhost:9090"],
    },
};

export default function () {
    http.get("http://localhost:1234/");
    sleep(1);
}
