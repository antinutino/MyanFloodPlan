import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer'
import Body from '../components/Body'

function HomePage() {
  return (
    <>
    <Header></Header>
    <Outlet></Outlet>
    </>
  )
}

export default HomePage