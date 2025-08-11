import { useEffect, useState } from "react"
import { useRef } from "react";
import {Chart, registerables} from "chart.js"

Chart.register(...registerables);

export default function InstructorChart({ courses }) {

  const [currChart, setCurrChart] = useState("students");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);


   const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Data for the chart displaying student information
  const studentLabel = courses.map((course) => course.courseName);
  // console.log(studentLabel);
  const studentData = courses.map((course) => course.studentsEnrolled.length);
  // console.log(studentData);

  const instructorData = courses.map((course) => parseInt(course.price) * parseInt(course.studentsEnrolled.length));
  // console.log(instructorData);

  const studentsChartData = {
    labels: studentLabel,
    datasets:[
      {
        label: "Students Enrolled",
        data: studentData,
        backgroundColor:
          generateRandomColors(courses.length),
      }
    ]
  }

  const instructorChartDatas = {
    labels: studentLabel,
    datasets:[
      {
        label: "Income",
        data: instructorData,
        backgroundColor: 
          generateRandomColors(courses.length),
        
      }
    ]
  }

useEffect(() => {
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    
    const ctx = chartRef.current.getContext("2d");

   
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: currChart === "students" ? studentsChartData : instructorChartDatas,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [currChart, courses]);

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-gray-800 p-6 shadow-lg">
      <p className="text-xl font-bold text-white">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-full p-2 px-4 transition-all duration-200 ${
            currChart === "students"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-purple-400 hover:bg-gray-600"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-full p-2 px-4 transition-all duration-200 ${
            currChart === "income"
              ? "bg-purple-700 text-white"
              : "bg-gray-700 text-purple-400 hover:bg-gray-600"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-80 w-80 lg:h-96 lg:w-96 ">
        {courses && courses.length > 0 ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-700 rounded-md">
            <p className="text-gray-400">No data available to display.</p>
          </div>
        )}
      </div>
    </div>
  )
}