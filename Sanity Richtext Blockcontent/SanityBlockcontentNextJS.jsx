
import { useState, useRef, Fragment } from 'react'
import Image from "next/image";
import { IoBookOutline } from "react-icons/io5";
import { BsLink, BsSignpost, BsBriefcase } from "react-icons/bs";
import YouTube from 'react-youtube'
import getYouTubeId from 'get-youtube-id'
import Link from "next/link";
import SanityBlockContent from '@sanity/block-content-to-react';
import { useNextSanityImage } from 'next-sanity-image';
import { Dialog, Transition } from '@headlessui/react'

// Use your own Client setup  
import { sanityClient, urlForImage } from '@lib/sanity';


//These are my Custom Elements so you will have to use yours :)
import Button from "@/components/buttons/Button";
import TestimonialCard from "../testimonials/TestimonialCard";


const Body = (data) => {
    const { body, color, className, ButtonClassName, imageClassName, borderInternal, modal, setModal } = data;


    const BlockImage = ({ source }) => {
        const imageProps = (source) = useNextSanityImage(
            sanityClient,
            source
        );
        return <div className={imageClassName}><Image
            {...imageProps}
            layout='responsive'
            objectFit='contain'
            alt={source.alt || `Image alt not found`}
            sizes="(max-width: 800px) 100vw, 800px"
        />
        </div>
    }

    return (
        <SanityBlockContent className={className} blocks={body} serializers={{
            types: {
                image: (props => {
                    return <BlockImage source={props.node} />
                }
                ),
                file: (props) => {
                    return <Button href={props.node.url + '?dl'} color={color || 'carrot'} className={ButtonClassName}>{props.node.title || 'Download'}</Button>
                },
                logo: (props => {
                    return <img src={urlForImage(props.node).width(400)} alt={props.node.title} className='inline w-48 p-5' />
                }),
                youtube: ({ node }) => {
                    const { url } = node
                    const id = getYouTubeId(url)
                    return <div className="flex flex-row justify-center my-5"> <YouTube videoId={id} className='youtube' /></div>
                },
                externalBtn: (props) => {
                    return <Button href={props.node.url} color={color || 'carrot'} className={ButtonClassName} border external>{props.node.title}</Button>
                },
                internalBtn: (props) => {
                    const link = props.node.reference === 'news' ? `/news${props.node.slug}`
                        : props.node.slug;
                    return <Button href={link} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>
                },
                functionalButton: (props) => {
                    if (props.node.element === 'apply') return <Button onClick={() => setModal({ ...modal, apply: true })} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>

                    if (props.node.element === 'donate') return <Button onClick={() => setModal({ ...modal, donate: true })} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>

                    if (props.node.element === 'subscribe') return <Button onClick={() => setModal({ ...modal, subscribe: true })} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>

                    if (props.node.element === 'contact') return <Button onClick={() => setModal({ ...modal, contact: true })} color={color || 'carrot'} className={ButtonClassName} border={borderInternal} >{props.node.title}</Button>

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

            marks: {
                link: (props) => {
                    return <a href={props.mark.url} className='underline' target="_blank" rel="noopener noreferrer">{props.children}  <BsLink className="inline mb-2 text-grey opacity-30" /></a>
                },
                internalLink: (props) => {

                    return <Link href={props.mark.slug} ><a className='underline'>{props.children}   <BsSignpost className="inline mb-1 text-grey opacity-30" /></a></Link>
                },
                publication: (props) => {
                    const close = useRef(null)
                    const [isOpen, setIsOpen] = useState(false)

                    return (
                        <span>
                            <span className="px-2 underline text-paladin-400" onClick={() => setIsOpen(true)}>{props.children}  <IoBookOutline className="inline mb-1 text-grey opacity-30" /></span>
                            <Transition
                                as={Fragment}
                                show={isOpen}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog
                                    className="fixed inset-0 z-10 overflow-y-auto"
                                    onClose={() => setIsOpen(false)}>

                                    {/* MODAL POSITION VIEWPORT */}
                                    <div className="flex flex-col items-center justify-center min-h-screen ">

                                        {/* MODAL WINDOW */}
                                        <div className="relative max-w-md p-6 mx-6 bg-white md:mx-auto pb-9 shadow-2">
                                            {/* CLOSE BUTTON*/}
                                            <div className="flex justify-end">
                                                <button ref={close} className='px-2' onClick={() => setIsOpen(false)}> X </button>
                                            </div>
                                            {/* CONTENT */}
                                            <p className='p-3 mx-3'>{props.mark.reference.title}</p>
                                            <p className='pb-5 mx-6 text-sm text-justify'>{props.mark.reference.description}</p>
                                            <a href={props.mark.reference.url} className='pb-5 mx-6 text-paladin-300' target="_blank" rel="noopener noreferrer">Read full Publication</a>
                                        </div>

                                    </div>
                                </Dialog>
                            </Transition>
                        </span>
                    )
                },
                job: (props) => {
                    const close = useRef(null)
                    const [isOpen, setIsOpen] = useState(false)
                    return (
                        <span>
                            <span className="px-2 underline text-paladin-400" onClick={() => setIsOpen(true)}>{props.children}  <BsBriefcase className="inline mb-1 text-grey opacity-30" /></span>
                            <Transition
                                as={Fragment}
                                show={isOpen}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog
                                    className="fixed inset-0 z-10 overflow-y-auto"
                                    onClose={() => setIsOpen(false)}>

                                    {/* MODAL POSITION VIEWPORT */}
                                    <div className="flex flex-col items-center justify-center min-h-screen ">

                                        {/* MODAL WINDOW */}
                                        <div className="relative max-w-md p-6 mx-6 bg-white md:mx-auto pb-9 shadow-2">
                                            {/* CLOSE BUTTON*/}
                                            <div className="flex justify-end">
                                                <button ref={close} className='px-2' onClick={() => setIsOpen(false)}> X </button>
                                            </div>
                                            {/* CONTENT */}
                                            <p className='p-3 mx-3'>{props.mark.reference.title}</p>
                                            <p className='mx-6 text-sm text-justify '>{props.mark.reference.description}</p>
                                            <p className='pb-5 mx-6 text-sm text-justify'>{props.mark.reference.location}</p>
                                            <a href={props.mark.reference.url} className='pb-5 mx-6 text-paladin-300' target="_blank" rel="noopener noreferrer">Read more about the vacancy</a>
                                        </div>

                                    </div>
                                </Dialog>
                            </Transition>
                        </span>
                    )
                }
            }
        }} />
    );
}

export default Body;
