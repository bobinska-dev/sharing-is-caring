
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
        <PortableText value={body} className={className} components={

            // These are block types, like the youtube object or buttons etc. which are elements of their own in the body[]
            // To use the data from types, you access them through props.node.NameOfField

            types: {
                image: (value => {
                    return <BlockImage source={value} />
                }),

                file: (value) => {
                    // to make assets (images, files...) downloadable you just add a '?dl' to the url and voilà your file can be served 
                    return <Button href={value?.url + '?dl'} color={color || 'carrot'} className={ButtonClassName}>{value.title || 'Download'}</Button>
                },

                logo: (value => {
                    return <img src={urlForImage(value).width(400)} alt={'Logo' + value.title}/>
                }),

                youtube: ({ value }) => {
                    const { url } = value
                    const id = getYouTubeId(url)
                    return <div > <YouTube videoId={id} className='youtube' /></div>
                },

                externalBtn: (value) => {
                    return <Button href={value?.url} color={color || 'carrot'} className={ButtonClassName} border external>{value.title}</Button>
                },


                internalBtn: (value) => {

                    // if you have nested landing pages (...news/[slug]) you need to take those into account when routing, because you need add the "folder"-syntax to the slug for Link components to work
                    //  Just find out if the reference is to a news-doc and then add '/news' to your slug. If not use the bare queried slug (see lib/queries to understand why it is slug not slug.current here)

                    const link = value?.reference === 'news' ? `/news${value.slug}`
                        : value.slug;
                    return <Button href={link} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{value.title}</Button>
                },

                functionalButton: (value) => {
                    /* I just left one line here, so you see, how you can use props given to the body component inside the serializer, which took me some time in the beginning. Maybe it helps  */
                    if (value.element === 'apply') return <Button onClick={() => setModal({ ...modal, apply: true })} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{value.title}</Button>

                    /* ... */
                    else return null
                },
                testimonial: (value) => {
                    return (
                        <div className="inline-flex self-center w-2/5 m-6">
                            <TestimonialCard key={value.reference._id} data={value.reference} />
                        </div>
                    )
                }
            },

            // These are the annotations in richText Schema 
            // To use the data from marks, access them through props.mark.NameOfField
            marks: {
                link: ({children, value}) => {
                    return <a href={value.url} className='underline' target="_blank" rel="noopener noreferrer">{children}  <BsLink className="inline mb-2 text-grey opacity-30" /></a>
                },
                internalLink: ({children, value}) => {

                    return <Link href={value.slug} ><a className='underline'>{children}   <BsSignpost className="inline mb-1 text-grey opacity-30" /></a></Link>
                },
                publication: ({children, value}) => {

                    return (
                        <span>
                            {/* the text, that is annoted (?) is accessible through props.children */}
                            <span>{children}  <IoBookOutline /></span>
                            
                            {/* the info, that is referenced through the annotation can is accessble through props.mark.QueriedInfo (this are the things we defined in lib/queries) */}
                            <SomeAwesomeComponent>
                                <p className='p-3 mx-3'>{value.reference.title}</p>
                                <p className='pb-5 mx-6 text-sm text-justify'>{props.reference.description}</p>
                                <a href={value.reference.url} className='pb-5 mx-6 text-paladin-300' target="_blank" rel="noopener noreferrer">Read full Publication</a>
                            </SomeAwesomeComponent>

                        </span>
                    )
                },
                job: ({children, value}) => {
                    return (
                        <span>
                            <span >{children}  <BsBriefcase /></span>
                            <SomeAwesomeComponent>
                                            <p >{value.reference.title}</p>
                                            <p >{value.reference.description}</p>
                                            <p >{value.reference.location}</p>
                                            <a href={value.reference.url} target="_blank" rel="noopener noreferrer">Read more about the vacancy</a>
                            </SomeAwesomeComponent>
                        </span>
                    )
                }
            }
        } />
    );
}

export default Body;
