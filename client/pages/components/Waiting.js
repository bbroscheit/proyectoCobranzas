import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

function Waiting() {
  return (
    <div>
    <h1>Por favor espere....</h1>
    <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Waiting