import React from 'react'
import style from '../modules/cardgestiones.module.css'
import { FaBriefcase } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";


function CardGestiones() {
  return (
    <div className={style.cardContainer}>
        <div className={style.titulos}>
            <FaBriefcase className={style.iconos}/>
            <div className={style.gestiones}>
                <div className={style.numerogestion}>
                    <h1>1</h1>
                    <FaArrowUp className={style.icononumerogestionup}/>
                </div>
                <p> Gestiones en total</p>
            </div>
        </div>
        <p className={style.piedepagina}> 1 Gestiones en total</p>
    </div>
  )
}

export default CardGestiones