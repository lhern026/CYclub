
import React from "react";
import '../Burger/Burgerstyled.css'

export default ({ open, ...props }) => (
  <nav className={open ? "burger-menu open" : "burger-menu"} {...props}>
    <div className="bar1" key="b1" />d
    <div className="bar2" key="b2" />s
    <div className="bar3" key="b3" />s
  </nav>
);