import React,{ useState, useEffect } from 'react'
import style from '../modules/cardalarmas.module.css'
import { FaBell } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";

function CardAlarmas() {
  const [alarmas, setAlarmas] = useState(0)

  useEffect(() => {
    fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/allAlarmsInMonth`)
    .then(res => res.json())
    .then(data => {
      setAlarmas(data.length)
    })
  }, [alarmas])

  return (
    <div className={style.cardContainer}>
        <div className={style.titulos}>
            <FaBell className={style.iconos}/>
            <div className={style.gestiones}>
                <div className={style.numerogestion}>
                    <h1>{alarmas}</h1>
                    <FaArrowUp className={style.icononumerogestionup}/>
                </div>
                <p> .</p>
            </div>
        </div>
        <p className={style.piedepagina}> {alarmas} Alarmas este mes</p>
    </div>
  )
}

export default CardAlarmas