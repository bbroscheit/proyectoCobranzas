import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import styles from "../modules/diasCalle.module.css";

function DiasCalle({data}) {
  
  const dias = data?.dias ?? 0;
  const cuentasPorCobrar = data?.cuentasPorCobrar ?? 0;
  const ventasDiariasPromedio = data?.ventasDiariasPromedio ?? 0;

  const chartRef = useRef(null);
  
  

  let backgroundColor;
  if (dias < 30) {
    backgroundColor = "rgb(60,190,100,0.7)";
  } else if (dias < 60) {
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
              data: [dias],
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
  }, [data]);

  const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

  //console.log("datoCalculado", datoCalculado);

  return (
    <div className={styles.canvaContainer}>
      <canvas ref={chartRef} />
      <h2 className={styles.title}>{dias}</h2>

      <div className={styles.formula}>
  <p>
    {currencyFormatter.format(cuentasPorCobrar)} /{" "}
    {currencyFormatter.format(ventasDiariasPromedio)}
  </p>
</div>
    </div>
  );
}

export default DiasCalle;
