
import { useState, useRef, Fragment } from 'react'
import Image from "next/image";
import { IoBookOutline } from "react-icons/io5";
import { BsLink, BsSignpost, BsBriefcase } from "react-icons/bs";
import YouTube from 'react-youtube'
import getYouTubeId from 'get-youtube-id'
import Link from "next/link";
import {PortableText} from '@portabletext/react'
import { useNextSanityImage } from 'next-sanity-image';


// Use your own Client setup  
import { sanityClient, urlForImage } from '@lib/sanity';


//These are my Custom Elements from my front end, so you will have to use yours :)
import Button from "@/components/buttons/Button";
import TestimonialCard from "../testimonials/TestimonialCard";


const Body = (data) => {

    //these are some Props I use to modify my Body Element depending on where I use it. The only thing you need to query is body (blocks), but I also added a color and button color selector for pages in my studio, so I add them as well
    const { body, color, className, ButtonClassName, imageClassName, borderInternal, modal, setModal } = data;

    // This is for a Block Image, that is set inside the richText.
    //      There are a lot of things that can be defined with next-sanity-image, so check out the repo!
    const BlockImage = ({ source }) => {
        const imageProps = (source) = useNextSanityImage(
            sanityClient,
            source
        );
        return <div className={imageClassName} ><Image
            {...imageProps}
            layout='responsive'
            objectFit='contain'
            alt={source.alt || `Image alt not found`}
            sizes="(max-width: 800px) 100vw, 800px"
        />
        </div>
    }

    return (
        <PortableText value= ={body} className={className} components={

            // These are block types, like the youtube object or buttons etc. which are elements of their own in the body[]
            // To use the data from types, you access them through props.node.NameOfField

            types: {
                image: (props => {
                    return <BlockImage source={props.node} />
                }),

                file: (props) => {
                    // to make assets (images, files...) downloadable you just add a '?dl' to the url and voilà your file can be served 
                    return <Button href={props.node.url + '?dl'} color={color || 'carrot'} className={ButtonClassName}>{props.node.title || 'Download'}</Button>
                },

                logo: (props => {
                    return <img src={urlForImage(props.node).width(400)} alt={props.node.title}/>
                }),

                youtube: ({ node }) => {
                    const { url } = node
                    const id = getYouTubeId(url)
                    return <div > <YouTube videoId={id} className='youtube' /></div>
                },

                externalBtn: (props) => {
                    return <Button href={props.node.url} color={color || 'carrot'} className={ButtonClassName} border external>{props.node.title}</Button>
                },


                internalBtn: (props) => {

                    // if you have nested landing pages (...news/[slug]) you need to take those into account when routing, because you need add the "folder"-syntax to the slug for Link components to work
                    //  Just find out if the reference is to a news-doc and then add '/news' to your slug. If not use the bare queried slug (see lib/queries to understand why it is slug not slug.current here)

                    const link = props.node.reference === 'news' ? `/news${props.node.slug}`
                        : props.node.slug;
                    return <Button href={link} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>
                },

                functionalButton: (props) => {
                    /* I just left one line here, so you see, how you can use props given to the body component inside the serializer, which took me some time in the beginning. Maybe it helps  */
                    if (props.node.element === 'apply') return <Button onClick={() => setModal({ ...modal, apply: true })} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>

                    /* ... */
                    else return null
                },
                testimonial: (props) => {
                    console.log(props.node)
                    return (
                        <div className="inline-flex self-center w-2/5 m-6">
                            <TestimonialCard key={props.node.reference._id} data={props.node.reference} />
                        </div>
                    )
                }
            },

            // These are the annotations in richText Schema 
            // To use the data from marks, access them through props.mark.NameOfField
            marks: {
                link: (props) => {
                    return <a href={props.mark.url} className='underline' target="_blank" rel="noopener noreferrer">{props.children}  <BsLink className="inline mb-2 text-grey opacity-30" /></a>
                },
                internalLink: (props) => {

                    return <Link href={props.mark.slug} ><a className='underline'>{props.children}   <BsSignpost className="inline mb-1 text-grey opacity-30" /></a></Link>
                },
                publication: (props) => {

                    return (
                        <span>
                            {/* the text, that is annoted (?) is accessible through props.children */}
                            <span>{props.children}  <IoBookOutline /></span>
                            
                            {/* the info, that is referenced through the annotation can is accessble through props.mark.QueriedInfo (this are the things we defined in lib/queries) */}
                            <SomeAwesomeComponent>
                                <p className='p-3 mx-3'>{props.mark.reference.title}</p>
                                <p className='pb-5 mx-6 text-sm text-justify'>{props.mark.reference.description}</p>
                                <a href={props.mark.reference.url} className='pb-5 mx-6 text-paladin-300' target="_blank" rel="noopener noreferrer">Read full Publication</a>
                            </SomeAwesomeComponent>

                        </span>
                    )
                },
                job: (props) => {
                    return (
                        <span>
                            <span >{props.children}  <BsBriefcase /></span>
                            <SomeAwesomeComponent>
                                            <p >{props.mark.reference.title}</p>
                                            <p >{props.mark.reference.description}</p>
                                            <p >{props.mark.reference.location}</p>
                                            <a href={props.mark.reference.url} target="_blank" rel="noopener noreferrer">Read more about the vacancy</a>
                            </SomeAwesomeComponent>
                        </span>
                    )
                }
            }
        } />
    );
}

export default Body;
