import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import styles from '../modules/ventasVsCobranzas.module.css';
import { calculaVentasVsCobranzas } from '../functions/calculaVentasVsCobranzas';

function VentasVsCobranzas({ facturasContext }) {
    const facturas = facturasContext;
    const { meses, facturasVencidas, recibosRecibidos, facturasNoVencidas } = calculaVentasVsCobranzas(facturas);
    const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext('2d');
      const newChart = new Chart(context, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Vencido',
              data: facturasVencidas,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Pendiente',
              data: facturasNoVencidas,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: 'Pagado',
              data: recibosRecibidos,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
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
  }, [facturas]);

  return <div className={styles.canvaContainer}><canvas ref={chartRef} /></div>;
}

export default VentasVsCobranzas;