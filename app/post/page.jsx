"use client"
import React from 'react'
import dynamic from 'next/dynamic';
      const logoStyle = {
    background: '#000000',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2em', // Adjust the font size as needed
    fontWeight: 'bold', // Adjust the font weight as needed
    display: 'inline-block',
  };
  const Component = dynamic(
  () => import('../components/postComponent'),
  { ssr: false,
    loading:()=><div className='h-screen w-full flex justify-center items-center'><h1 style={logoStyle} >Loading...</h1></div>
  
  }
)
const page = () => {
  return (
    <div>
    
      <Component/>
    </div>
  )
}

export default page
