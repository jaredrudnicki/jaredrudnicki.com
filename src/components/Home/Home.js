import "./Home.css";
import {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import Navbar from "@acto/react-navbar";


import image1 from "../../images/profile1.jpg"
import image_profile_2 from "../../images/profile2.jpg"
import image_jrivia from "../../images/jrivia.PNG"
import image_gift_picker from "../../images/giftpicker.PNG"
import gallery1 from "../../images/4_0157.png"
import gallery2 from "../../images/emerald_deck.png"
import gallery3 from "../../images/CKlogo-white-03.png"
import gallery4 from "../../images/GreenifyInfographic.png"
import gallery5 from "../../images/BJoker_Mockup.jpg"
import gallery6 from "../../images/squiggles.png"

const Home = () => {
    const [navVisible, setNavVisible] = useState(false);

    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMessage, setContactMessage] = useState('');

    const menuTheme = {
        backgroundColor: '#222C33',
        mainColor: 'white',
        menuBgColor: '#222C33',
      }


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
            {navVisible && 
            <Navbar
                className="nav-bar" // style .navbar in your css
                menuClassName="navbar--menu" // style .navbar--menu in your css
                brand={<a href="#header">Jared Rudnicki</a>}
                theme={menuTheme}
                rightLinks={(<>
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#contact">Contact</a>
                </>)}
                shouldHideOnScroll={false}
            />}
        </div>
        <div className="header" id="header">
            <div className="container-body">
                <div className="row header-name">
                    <h1 className="firstname">Jared</h1>
                    <h1 className="lastname">Rudnicki</h1>
                </div>
                <div className="row header-nav">
                    <div className="col-3"><a href="#about">About</a></div>
                    <div className="col-3"><a href="#projects">Projects</a></div>
                    <div className="col-3"><a href="#gallery">Gallery</a></div>
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
                    <div style={{display:"flex"}}><i class="fas fa-link" style={{padding:"20px"}}></i><h2><pre>Jrivia      </pre> </h2></div>
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
                        <div style={{display:"flex"}}><i class="fas fa-link" style={{padding:"20px"}}></i><h2><pre>Gift Picker </pre></h2></div>
                    </a>
                    
                    <div className="jrivia-description col">
                        <h5>Tools: Typescript, React, HTML/CSS/SCSS</h5>
                        <p>{`
                        This is a project that I worked on in collaboration with TAMID tech consulting and Presently.
                        My role as a developer resulted in the creation of a matching algorithm that generated an ordered 
                        list of gifts determined by weighted features that is best suited for the identified individual.
                        I also contributed to the logic that handled moving throught the questions, and the logic for 
                        showing the results. Other contributions include small features and design changes.
                        `}</p>
                        
                        <a href="https://github.com/getpresently/gift-picker"><i class="fab fa-github"></i> github</a>
                    </div> 
                </div>
                

                
                <div className="jrivia row">
                    <Link to="/figma-designs" className="jrivia-title col" style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(255, 255, 255, 0.25)), url(${image1})`}}>
                        <div style={{display:"flex"}}><i class="fas fa-link" style={{padding:"20px"}}></i><h2><pre>This Website</pre></h2></div>
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



            <div id="gallery">
                <h1>Gallery</h1>
                <div className="row">
                    <div className="col-4 gallery-item">
                        <img src={gallery1} alt="gallery1" />
                        <a href={gallery1} target="_blank" style={{ color: "white"}} rel="noreferrer">
                            <div className="caption">
                                <p style={{width: "20vw"}}>A render of the back of the "Molinos" deck</p>
                            </div>
                        </a>
                    </div>
                    <div className="col-4 gallery-item">
                        <img src={gallery2} alt="gallery1" />
                        <a href={gallery2} target="_blank" style={{ color: "white"}} rel="noreferrer">
                            <div className="caption">
                                <p style={{width: "20vw"}}>Emerald and jungle themed deck concept</p>
                            </div>
                        </a> 
                    </div>
                    <div className="col-4 gallery-item">
                        <img src={gallery3} alt="gallery1" />
                        <a href={gallery3} target="_blank" style={{ color: "white"}} rel="noreferrer">
                            <div className="caption">
                                <p style={{width: "20vw"}}>Logo design for my brother's homemade beer</p>
                            </div> 
                        </a>
                        
                    </div>
                </div>

                <div className="row">
                    <div className="col-4 gallery-item">
                        <img src={gallery4} alt="gallery1" />
                        <a href={gallery4} target="_blank" style={{ color: "white"}} rel="noreferrer">
                            <div className="caption">
                                <p style={{width: "20vw"}}>Made a clearer version of an inforgraphic in a scholarly paper</p>
                            </div>
                        </a>
                    </div>
                    <div className="col-4 gallery-item">
                        <img src={gallery5} alt="gallery1" />
                        <a href={gallery5} target="_blank" style={{ color: "white"}} rel="noreferrer">
                            <div className="caption">
                                <p style={{width: "20vw"}}>Mockup made for "Molinos" deck, higlighting the joker and back design</p>
                            </div>
                        </a> 
                    </div>
                    <div className="col-4 gallery-item">
                        <img src={gallery6} alt="gallery1" />
                        <a href={gallery6} target="_blank" style={{ color: "white"}} rel="noreferrer">
                            <div className="caption">
                                <p style={{width: "20vw"}}>Pattern used as my LinkedIn profile backdrop</p>
                            </div> 
                        </a>
                        
                    </div>
                </div>
            </div> 


            
            <div className="contact" id="contact">
                <h3>Contact Me</h3>
                <p>
                    If you want to reach out to me for any reason, if you have a project you are working on or if you just want to talk, send me an email by filling out the form.
                </p>
                <form onSubmit={e => {window.open(`mailto:jared.a.rudnicki@gmail.com?subject=Message From ${contactName}&body=${contactMessage}`); e.preventDefault();}}>
                    <label for="contact-name">name</label>
                    <input id="contact-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)}></input> <br/>
                    <label for="contact-email">email</label>
                    <input id="contact-email" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}></input> <br />
                    
                    <label for="contact-message">message</label>
                    <textarea id="contact-message" required value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows="8" placeholder="Hello Jared,&#10;I am John Doe and I would love to schedule some time to talk to you.&#10;Best,&#10;John">
                    </textarea> <br />
                    <button>Send <i class="fas fa-paper-plane"></i></button>
                </form>
            </div> 
            
        </div>
        
        <div className="footer-background">
            <div className="footer">
                    <a href="https://github.com/jaredrudnicki/jaredrudnicki.com">
                        <h6><i class="fas fa-code-branch"></i> Built and Designed by Jared Rudnicki</h6>
                    </a>
                    <a href="https://github.com/jaredrudnicki">
                        <p><i class="fab fa-github"></i> jaredrudnicki</p>
                    </a>
                    <a href="https://www.linkedin.com/in/jared-rudnicki/">
                        <p><i class="fab fa-linkedin"></i> jared-rudnicki</p>
                    </a>
            </div>
        </div> 
    </div>
    )
}

export default Home;