import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import styles from "../modules/diasCalle.module.css";
import { calcularDiasCalle } from "../functions/calcularDiasCalle";

function DiasCalle({ facturasContext }) {
  const facturas = facturasContext;
  const chartRef = useRef(null);
  const datoCalculado = calcularDiasCalle(facturas);

  let backgroundColor;
  if (datoCalculado < 30) {
    backgroundColor = "rgb(60,190,100,0.7)"; 
  } else if (datoCalculado < 60) {
    backgroundColor = "rgb(255,205,86,0.7)"; 
  } else {
    backgroundColor = "rgb(255,99,132,0.7)"; 
  }

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "doughnut",
        data: {
          labels: ["Días Calle"],
          datasets: [
            {
              label: "Días Calle",
              data: [datoCalculado],
              backgroundColor: [backgroundColor],
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      chartRef.current.chart = newChart;
    }
  }, [datoCalculado]);

  return (
    <div className={styles.canvaContainer}>
      <canvas ref={chartRef} />
      <h2 className={styles.title}>{datoCalculado}</h2>
    </div>
  );
}

export default DiasCalle;
