import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import styles from "../modules/anticuacion.module.css";
import useUser from "../hooks/useUser";
import { montosPorAntiguedad } from "../functions/montosPorAntiguedad";

function Anticuacion() {
  const [gestor, setGestor] = useUser("");
  const [facturasVencidasBD, setFacturasVencidasBD] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userParse.id}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFacturasVencidasBD(montosPorAntiguedad(data));
      });
  }, [gestor]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: [
            " < 0 ",
            "1 - 7 ",
            " 8 - 15 ",
            " 16 - 30 ",
            "31 - 60",
            " 61 - 90 ",
            " 90 - 120 ",
            " +120 ",
          ],
          datasets: [
            {
              label: "",
              data: facturasVencidasBD,
              backgroundColor: [
                "rgb(255,99,132,0.7)",
                "rgb(255,159,64,0.7)",
                "rgb(255,205,86,0.7)",
                "rgb(75,192,192,0.7)",
                "rgb(54,162,235,0.7)",
                "rgb(153,102,255,0.7)",
                "rgb(201,203,207,0.7)",
              ],
              borderWidth: 1,
              borderRadius: 5,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "category",
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "ARS",
                    }).format(context.parsed.y);
                  }
                  return label;
                },
              },
            },
          },
        },
      });
      chartRef.current.chart = newChart;
    }
  }, [facturasVencidasBD]);

  return (
    <div className={styles.canvaContainer}>
      <canvas ref={chartRef} />
    </div>
  );
}

export default Anticuacion; 
