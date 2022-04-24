import './Navbar.css';
import React from 'react';
import {  Link } from "react-router-dom";

export default function Navbar(){
    
    return (
        
        <div className='navBar'>
            <ul>
                
                <li className='navs'><a href='#faq'>Logo</a></li>
                <li className='navs'>Roadmap</li>
                <li className='navs'>Faq</li>
                <li className='navs'>Whtiepaper</li>
            </ul>
  </div>
        
    )
}