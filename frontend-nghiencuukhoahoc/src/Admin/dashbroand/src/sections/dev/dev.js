import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Đăng ký tự động

const BarChart = () => {
    const data = {
        labels: ["January", "February", "March", "April"],
        datasets: [
            {
                label: "Sales",
                data: [30, 20, 50, 80],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };

    return <Bar data={data} />;
};

export default BarChart;
