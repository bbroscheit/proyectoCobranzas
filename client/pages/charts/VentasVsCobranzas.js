import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import styles from "../modules/ventasVsCobranzas.module.css";


function VentasVsCobranzas({ data }) {
  const chartRef = useRef(null);
      
  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: data ? data.meses : [1/2025,2/2025,3/2025,4/2025,5/2025,6/2025,7/2025,8/2025,9/2025,10/2025,11/2025,12/2025],
          datasets: [
            {
              label: "Vencido",
              data: data ? data.facturasVencidas : [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
              label: "Pendiente",
              data: data ? data.facturasNoVencidas : [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor: "rgba(54, 162, 235, 0.5)",
            },
            {
              label: "Pagado",
              data: data ? data.facturasCobradas : [0,0,0,0,0,0,0,0,0,0,0,0],
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
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
  }, [data]);

  //console.log("ventaCobranzas", ventaCobranzas);

  return (
    <div className={styles.canvaContainer}>
      <canvas ref={chartRef} />
    </div>
  );
}

export default VentasVsCobranzas;
