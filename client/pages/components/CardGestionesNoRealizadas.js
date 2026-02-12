import React from 'react'
import style from '../modules/cardgestiones.module.css'
import { FaBriefcase } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";


function CardGestionesNoRealizadas({total}) {
  return (
    <div className={style.cardContainer}>
        <div className={style.titulos}>
            <FaBriefcase className={style.iconos}/>
            <div className={style.gestiones}>
                <div className={style.numerogestion}>
                    <h1>{total ? total : 0}</h1>
                    <FaArrowUp className={style.icononumerogestionup}/>
                </div>
                <p> Gestiones no cumplidas</p>
                <p> Mes en Curso</p>
            </div>
        </div>
        {/* <p className={style.piedepagina}> 1 Gestiones cumplidas en total</p> */}
    </div>
  )
}

export default CardGestionesNoRealizadas