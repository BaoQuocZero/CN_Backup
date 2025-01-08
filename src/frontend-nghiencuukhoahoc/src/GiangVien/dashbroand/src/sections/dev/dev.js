import React from "react";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  Bubble,
  Scatter,
  Chart,
  PolarArea,
} from "react-chartjs-2";
import "chart.js/auto"; // Đăng ký tự động

const Charts = () => {
  // Biểu đồ cột (Bar Chart)
  const barData = {
    labels: ["Toán", "Lý", "Hóa", "Sinh"], // Các môn học
    datasets: [
      {
        label: "Bảo",
        data: [99, 85, 70, 90], // Điểm của Bảo trong các môn
        backgroundColor: ["#FF6384", "#FF6384", "#FF6384", "#FF6384"], // Màu sắc cột cho Bảo
      },
      {
        label: "Nhân",
        data: [34, 55, 40, 60], // Điểm của Nhân trong các môn
        backgroundColor: ["#36A2EB", "#36A2EB", "#36A2EB", "#36A2EB"], // Màu sắc cột cho Nhân
      },
      {
        label: "Phúc",
        data: [89, 70, 80, 85], // Điểm của Phúc trong các môn
        backgroundColor: ["#FFCE56", "#FFCE56", "#FFCE56", "#FFCE56"], // Màu sắc cột cho Phúc
      },
      {
        label: "Thành",
        data: [90, 88, 75, 92], // Điểm của Thành trong các môn
        backgroundColor: ["#4BC0C0", "#4BC0C0", "#4BC0C0", "#4BC0C0"], // Màu sắc cột cho Thành
      },
    ],
  };

  // Biểu đồ đường (Line Chart)
  const lineData = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Temperature",
        data: [30, 35, 40, 15],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const lineData2 = {
    labels: ["January", "February", "March", "April"], // Các tháng
    datasets: [
      {
        label: "Temperature", // Đường thể hiện nhiệt độ
        data: [30, 35, 40, 15], // Dữ liệu nhiệt độ theo các tháng
        borderColor: "#FF6384", // Màu đường
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu nền của đường
        fill: true, // Điền màu phía dưới đường
      },
      {
        label: "Humidity", // Đường thể hiện độ ẩm
        data: [60, 65, 50, 70], // Dữ liệu độ ẩm theo các tháng
        borderColor: "#36A2EB", // Màu đường
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Màu nền của đường
        fill: true, // Điền màu phía dưới đường
      },
      {
        label: "Pressure", // Đường thể hiện áp suất
        data: [1015, 1018, 1020, 1013], // Dữ liệu áp suất theo các tháng
        borderColor: "#FFCE56", // Màu đường
        backgroundColor: "rgba(255, 206, 86, 0.2)", // Màu nền của đường
        fill: true, // Điền màu phía dưới đường
      },
    ],
  };

  const lineData3 = {
    labels: ["January", "February", "March", "April"], // Các tháng
    datasets: [
      {
        label: "Temperature", // Đường thể hiện nhiệt độ
        data: [30, 35, 40, 15], // Dữ liệu nhiệt độ theo các tháng
        borderColor: "#FF6384", // Màu đường
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Màu nền phía dưới đường
        fill: true, // Điền màu phía dưới đường
        borderWidth: 4, // Độ dày của đường
        lineTension: 0.4, // Mức độ cong của đường
        pointBackgroundColor: "#FF6384", // Màu sắc của các điểm trên đường
        pointRadius: 6, // Kích thước các điểm
        pointHoverRadius: 8, // Kích thước khi hover
        pointBorderWidth: 2, // Độ dày của viền điểm
        pointHoverBackgroundColor: "#FF6384", // Màu nền của điểm khi hover
        pointBorderColor: "#fff", // Màu viền của điểm
        tension: 0.4, // Mức độ cong cho các điểm
      },
      {
        label: "Humidity", // Đường thể hiện độ ẩm
        data: [60, 65, 50, 70], // Dữ liệu độ ẩm theo các tháng
        borderColor: "#36A2EB", // Màu đường
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Màu nền của đường
        fill: true, // Điền màu phía dưới đường
        borderWidth: 3, // Độ dày của đường
        lineTension: 0.2, // Mức độ cong của đường
        pointBackgroundColor: "#36A2EB", // Màu sắc của các điểm trên đường
        pointRadius: 6, // Kích thước các điểm
        pointHoverRadius: 8, // Kích thước khi hover
        pointBorderWidth: 2, // Độ dày của viền điểm
        pointHoverBackgroundColor: "#36A2EB", // Màu nền của điểm khi hover
        pointBorderColor: "#fff", // Màu viền của điểm
        borderDash: [5, 5], // Kiểu đường: dashed
      },
      {
        label: "Pressure", // Đường thể hiện áp suất
        data: [1015, 1018, 1020, 1013], // Dữ liệu áp suất theo các tháng
        borderColor: "#FFCE56", // Màu đường
        backgroundColor: "rgba(255, 206, 86, 0.2)", // Màu nền của đường
        fill: true, // Điền màu phía dưới đường
        borderWidth: 4, // Độ dày của đường
        lineTension: 0.5, // Mức độ cong của đường
        pointBackgroundColor: "#FFCE56", // Màu sắc của các điểm trên đường
        pointRadius: 6, // Kích thước các điểm
        pointHoverRadius: 8, // Kích thước khi hover
        pointBorderWidth: 2, // Độ dày của viền điểm
        pointHoverBackgroundColor: "#FFCE56", // Màu nền của điểm khi hover
        pointBorderColor: "#fff", // Màu viền của điểm
        borderCapStyle: "round", // Kiểu đầu đường tròn
      },
    ],
  };

  // Biểu đồ tròn (Pie Chart)
  const pieData = {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        data: [300, 50, 100, 75],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Biểu đồ bánh rán (Doughnut Chart)
  const doughnutData = {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        data: [300, 50, 100, 75],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Biểu đồ radar (Radar Chart)
  const radarData = {
    labels: ["Speed", "Strength", "Agility", "Endurance", "Skill"],
    datasets: [
      {
        label: "Player 1",
        data: [80, 70, 90, 60, 75],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointBackgroundColor: "#FF6384",
      },
      {
        label: "Player 2",
        data: [60, 80, 70, 85, 65],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: "#36A2EB",
      },
    ],
  };

  // Biểu đồ bong bóng (Bubble Chart)
  const bubbleData = {
    datasets: [
      {
        label: "Bubble Chart",
        data: [
          { x: 20, y: 30, r: 15 },
          { x: 40, y: 10, r: 10 },
          { x: 50, y: 50, r: 25 },
        ],
        backgroundColor: "#FF6384",
      },
    ],
  };

  // Biểu đồ phân tán (Scatter Chart)
  const scatterData = {
    datasets: [
      {
        label: "Scatter Chart",
        data: [
          { x: 10, y: 20 },
          { x: 30, y: 50 },
          { x: 50, y: 60 },
        ],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  // Biểu đồ hỗn hợp (Mixed Chart)
  const mixedData = {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Sales",
        type: "bar",
        data: [30, 20, 50, 80],
        backgroundColor: "#FF6384",
      },
      {
        label: "Revenue",
        type: "line",
        data: [20, 35, 40, 60],
        borderColor: "#36A2EB",
        fill: false,
      },
    ],
  };

  // Biểu đồ khu vực cực (Polar Area Chart)
  const polarData = {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        data: [300, 50, 100, 75],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h2>Bar Chart</h2>
        <Bar data={barData} />
      </div>

      <div className="col-md-6">
        <h2>Line Chart</h2>
        <Line data={lineData} />
      </div>

      <div className="col-md-6">
        <h2>Line Chart 2</h2>
        <Line data={lineData2} />
      </div>

      <div className="col-md-6">
        <h2>Line Chart 3</h2>
        <Line data={lineData3} />
      </div>

      <div className="col-md-6">
        <h2>Pie Chart</h2>
        <Pie data={pieData} />
      </div>

      <div className="col-md-6">
        <h2>Doughnut Chart</h2>
        <Doughnut data={doughnutData} />
      </div>

      <div className="col-md-6">
        <h2>Radar Chart</h2>
        <Radar data={radarData} />
      </div>

      <div className="col-md-6">
        <h2>Bubble Chart</h2>
        <Bubble data={bubbleData} />
      </div>

      <div className="col-md-6">
        <h2>Scatter Chart</h2>
        <Scatter data={scatterData} />
      </div>

      <div className="col-md-6">
        <h2>Mixed Chart</h2>
        <Chart type="bar" data={mixedData} />
      </div>

      <div className="col-md-6">
        <h2>Polar Area Chart</h2>
        <PolarArea data={polarData} />
      </div>
    </div>
  );
};

export default Charts;
