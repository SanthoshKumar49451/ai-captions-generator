import React from 'react'

const Password = () => {
    const[password, setPassword] = React.useState('')
  return (
    <div>
        <input type={password} value={password}   />
        <button onClick={()=>setPassword(password === 'password' ? 'text' : 'password')} >
            change to text
        </button>
    </div> 
  )
}

export default Password