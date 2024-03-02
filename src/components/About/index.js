import React from "react";

const About = () => {

    return (
        <div id="about">
        <br />
        <h1>About</h1>
    
    
            <div className="row profile-card">
                <p>{`Currently working as a `} <b> Software Engineer for Cox Automitive.</b> {` I graduated from Northeastern 
                University with a Bachelor of Science in Computer Science with a concentration in Artificial 
                Intelligence at Northeastern University. My primary interest lies at the intersection of design and development.
                
                Some languages and tools I love include Javascript (with ReactJS/NextJS), HTML/CSS, Python, SQL, 
                Figma, Postman, Flutter.`}</p>
                <br />
                <p>{`Hobbies: Squash, Running, Reading, Cooking`}</p>
            </div>
    
            <p style={{marginTop: "20px"}}>
                {`
                If you would like to reach out for any reason, if you want to chat or possibly 
                offer me an interview, you can
                `} 
                <a href="https://drive.google.com/file/d/1IzBSaOT6lEtYEnSY5eAiwjDGd983Ug6p/view?usp=sharing"> checkout my resume </a> or <a href="#contact">contact me.</a>
            </p>
    </div> 
    );
}

export default About;