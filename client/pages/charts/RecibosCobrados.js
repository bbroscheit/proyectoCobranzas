import React, { useRef , useEffect } from 'react'
import Chart from 'chart.js/auto';
import styles from '../modules/anticuacion.module.css'

function RecibosCobrados({facturasContext}){
    const facturasVencidas = facturasContext
    const chartRef = useRef(null)

    useEffect(() => {
        if(chartRef.current){
            if(chartRef.current.chart){
                chartRef.current.chart.destroy()
            }

            const context = chartRef.current.getContext("2d")
            const newChart = new Chart(context,{
                type:"bar",
                data:{
                    labels:[" < 0 ", "1 - 7 "," 8 - 15 ", " 16 - 30 ", "31 - 60", " 61 - 90 ", " 90 - 120 ", " +120 "],
                    datasets:[
                        {
                            label: "",
                            //data: [34, 64, 23, 45 , 67, 24, 64,36],
                            data: facturasVencidas,
                            backgroundColor: [
                                "rgb(255,99,132,0.7)",
                                "rgb(255,159,64,0.7)",
                                "rgb(255,205,86,0.7)",
                                "rgb(75,192,192,0.7)",
                                "rgb(54,162,235,0.7)",
                                "rgb(153,102,255,0.7)",
                                "rgb(201,203,207,0.7)",
                                "rgb(255,240,132,0.7)",
                                "rgb(255,159,150,0.7)",
                                "rgb(255,32,32,0.7)",
                                "rgb(20,192,30,0.7)",
                                "rgb(255,159,64,0.7)",
                                "rgb(255,205,86,0.7)",
                                "rgb(75,192,192,0.7)",
                            ],
                            borderWidth:1,
                            borderRadius:5,
                        }
                    ]
                },
                options:{
                    scales:{
                        x:{
                            type: "category"
                        },
                        y:{
                            beginAtZero:true
                        }
                    },
                    plugins:{
                        legend:{
                            display:false,
                        }
                    }
                }
            })
            chartRef.current.chart = newChart
        }
    },[])
    return(<div className={styles.canvaContainer}><canvas ref={chartRef}/></div>)
}

export default RecibosCobrados