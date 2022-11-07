import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown'

function MarkdownPage ({file}) {

    const [Markdown, setMarkdown] = useState('')

    useEffect(() => {
        fetch(file).then(
            response => response.text()
        ).then(text => {
            console.log(text)
            setMarkdown(text)
        })
    }, [])

   return(
    <div className="container">
        <a href="../reviews">back</a>
        <ReactMarkdown children={Markdown}/>
    </div>
    )
}
export default MarkdownPage ;
