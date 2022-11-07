import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import "./Markdown.css";

function Pages() {

    return (
        <div className="container">
            <h2>Reviews</h2>
            <hr />
            <Link to="./best_laptops_2022">Best Laptops 2022</Link>
        </div>
    )
}
export default Pages;