import React, { useRef, useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import Chart from "chart.js/auto";
import styles from "../modules/diasCallePorGestor.module.css";
import { calcularDiasCalle } from "../functions/calcularDiasCalle";
import { calcularDiasCallePorGestor } from "../functions/calcularDiasCallePorGestor";

function DiasCallePorGestor() {
  const [gestor, setGestor] = useUser("");
  const chartRef = useRef(null);
  const [datoCalculado, setDatoCalculado] = useState(null);

  let backgroundColor;
  if (datoCalculado < 30) {
    backgroundColor = "rgb(60,190,100,0.7)";
  } else if (datoCalculado < 60) {
    backgroundColor = "rgb(255,205,86,0.7)";
  } else {
    backgroundColor = "rgb(255,99,132,0.7)";
  }

  useEffect(() => {
    const userLogin = localStorage.getItem("userCobranzas");
    const userParse = JSON.parse(userLogin);

    fetch(
      `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsByGestor/${userParse.id}`
    )
      // fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsBySalepoint/${userLogin.id}`)
      .then((res) => res.json())
      .then((data) => {
        setDatoCalculado(calcularDiasCallePorGestor(data, userParse));
      });
  }, [gestor]);

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
            title: {
              display: true,
              text: "Días Calle",
              font: {
                size: 20,
              },
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

export default DiasCallePorGestor;
