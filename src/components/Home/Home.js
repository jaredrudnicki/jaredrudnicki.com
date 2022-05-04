import "./Home.css"
import {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import image1 from "../../images/profile1.jpg"
import image_profile_2 from "../../images/profile2.jpg"
import image_jrivia from "../../images/jrivia.PNG"
import image_gift_picker from "../../images/giftpicker.PNG"

function NavBar() {
    return (
        <div className="container" style={{border : "1px solid green"}}>
            <div className="nav-bar row justify-content-between">
                <div className="col-5">Jared Rudnicki</div>
                <div className="col-7 justify-right">
                    <button style={{float: "right"}}><a href="#about">about</a></button> 
                    <button style={{float: "right"}}><a href="#projects">projects</a></button>
                    <button style={{float: "right"}}><a href="#contact">contact</a></button>
                </div>
                
            </div>
        </div>
    )
}


const Home = () => {
    const [navVisible, setNavVisible] = useState(false);

    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');

    const listenToScroll = () => {
        let heightToHideFrom = 500;
        const winScroll = document.body.scrollTop || 
            document.documentElement.scrollTop;
           
        if (winScroll < heightToHideFrom) {       
            setNavVisible(false);
        } else {
            setNavVisible(true);
        }  
      };

    useEffect(() => {   
        window.addEventListener("scroll", listenToScroll);
        return () => 
            window.removeEventListener("scroll", listenToScroll); 
    })

    return (
        <div className="all">
        <div className="container">
            {navVisible && <NavBar />}
        </div>
        <div className="header" id="header">
            <div className="container-body">
                <h1 className="header-name">Jared Rudnicki</h1>
                <div className="row header-nav">
                    <div className="col-3"><a href="#about">About</a></div>
                    <div className="col-4"><a href="#projects">Projects</a></div>
                    <div className="col-2"><a href="#fun">Fun</a></div>
                    <div className="col-3"><a href="#contact">Contact</a></div>
                </div>
            </div>
        </div>


        <div className="container-body">
            <div id="about">
                <br />
                <h1>About</h1>
                <p>{`I am currently a third year Computer Science student
                with a concentration in Artificial Intelligence at Northeastern University. My primary
                interest in lies at the intersection of design and development.
                
                Some languages and tools I love include Javascript (with React), HTML/CSS, Python, SQL, 
                Figma, Postman.`}</p>
                
                <div className="row">
                    <div className="col-lg-4 col-12" style={{marginTop: "20px"}}>
                        <img src={image_profile_2} style={{verticalAlign: "middle", width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover", display: "block", margin: "auto"}}/>
                    </div>
                    <div className="col-lg-8 col-12" style={{marginTop: "20px"}}>
                        <h6>Place I call home</h6>
                        <p>Atlanta, GA</p>

                        <h6>Tools I love</h6>
                        <p>Javascript (with React), HTML/CSS, Python, SQL, Figma, Postman, Illustrator</p>

                        <h6>Tools I am learning</h6>
                        <p>Flutter</p>
                    </div>
                </div>
                



                <p style={{marginTop: "20px"}}>{`If you would like to reach out for any reason, if you want to chat or possibly 
                offer me an interview, you can`} <a href="resume"> checkout my resume </a> or <a href="#contact">contact me.</a></p>
            </div> 
            <div id="projects">
                <h1>Projects</h1>
                
                <div className="jrivia row">
                    
                    <a href="http://jrivia.herokuapp.com/" className="jrivia-title col" style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(255, 255, 255, 0.25)), url(${image_jrivia})`}}>
                    <div style={{display:"flex"}}><i class="fas fa-link" style={{padding:"20px"}}></i><h2>Jrivia</h2></div>
                    </a>
                    
                    <div className="jrivia-description col">
                        <h5>Tools: Express Node.js, React, HTML/CSS</h5>
                        <p>{`
                        This is a social web app that was developed for a school project.
                        It is capable of handling multiple types of users and posts. There is an authentication system
                        to register accounts, sign in, log out, and edit account information. General users can answer 
                        trivia questions and keep track of their correct to incorrect ratio. Moderators have extra 
                        permissions to create and delete trivia questions. 
                        `}</p>

                        <a href="github.com"><i class="fab fa-github"></i> github</a>
                    </div> 
                </div>
                
                <div className="jrivia row">
                    
                    <a href="https://giftpicker.io/" className="jrivia-title col" style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(255, 255, 255, 0.25)), url(${image_gift_picker})`}}>
                        <div style={{display:"flex"}}><i class="fas fa-link" style={{padding:"20px"}}></i><h2>Gift Picker </h2></div>
                    </a>
                    
                    <div className="jrivia-description col">
                        <h5>Tools: Typescript, React, HTML/CSS/SCSS</h5>
                        <p>{`
                        This is a project that I worked on in collaboration with TAMID tech consulting and Presently.
                        My role as a developer resulted in the creation of a matching algorithm that generated an ordered 
                        list of gifts determined by weighted features that is best suited for the identified individual.
                        I also contributed to the logic that handled moving throught the questions, and the logic for 
                        showing the results. Other contributions ionclude small features and design changes.
                        `}</p>
                        
                        <a href="https://github.com/getpresently/gift-picker"><i class="fab fa-github"></i> github</a>
                    </div> 
                </div>
                

                
                <div className="jrivia row">
                    <Link to="/figma-designs" className="jrivia-title col" style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(255, 255, 255, 0.25)), url(${image1})`}}>
                        <div style={{display:"flex"}}><i class="fas fa-link" style={{padding:"20px"}}></i><h2>This Website</h2></div>
                    </Link>
                    <div className="jrivia-description col">
                        <h5>Tools: HTML/CSS, Javascript (React), Figma</h5>
                        <p>{`
                        This is an ongoing portfolio for myself to highlight my skills and interests.
                        This was my second attempt at creating a portfolio. I wanted to implement a greater
                        design focus on this attempt, so I learned Figma for its design. Clicking on this 
                        will take you to the Figma designs. 
                        `}</p>

                        <a href="github.com"><i class="fab fa-github"></i> github</a>
                    </div> 
                </div>
            </div> 

            <div>
                <h5>Fun</h5>
                <ul>
                    <li>Playing Cards / Design Stuff</li>
                </ul>
            </div> 

            
            <h3>Contact Me</h3>
            <p>
                If you want to ask me any questions, if you need a friend, if you want to talk business, or if you want to offer me an interview (that would be epic) ...
            </p>
            <div className="contact" id="contact">
                
                <label for="contact-name">name</label>
                <input id="contact-name" type="text" value={contactName} onChange={(e) => setContactName(e.target.value)}></input> <br/>
                <label for="contact-email">email</label>
                <input id="contact-email" type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}></input> <br />
                
                <label for="contact-message">message</label>
                <textarea id="contact-message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows="8">
                </textarea> <br />
                <button>Send</button>
            </div> 
        </div>
        </div>
    )
}

export default Home;