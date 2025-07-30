export async function sendMailResumenVencido(emailData) {
    //console.log("soy email data", emailData)
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/mailResumenVencido`, {
      // const res = await fetch(`https://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/mailResumenVencido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
    const data = await res.json()
    
    return data
  }