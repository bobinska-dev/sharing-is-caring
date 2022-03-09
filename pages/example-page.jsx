import { groq } from "next-sanity";
import Head from 'next/head'

//This is my setup. I added the lib/queries as well, so you understand the extra step of finiding annotations in body[] which is the richTextSchema
import { getClient, usePreviewSubscription, filterDataToSingleItem } from '@lib/sanity';
import { linkQuery } from '@lib/queries';
import { PortableText } from '@lib/sanity';

// These are just my components which you an ignore or ask me about ☺️
import Body from '@/components/Body'


export default function Index({ data, preview, setModal, modal }) {

    // I setup a preview pane inside my studio; with this 👇 plus the preview API you can preview unpublished changes within the studio... 
  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.page,
    enabled: preview,
  })
  const page = filterDataToSingleItem(previewData, preview)
  

    // These are the props I need for the page, aka. my studio data
  const { ..., body } = data?.page;



  return (
    <>
    {/* ... Page Stuff */}

    {/* THIS IS THE BACON right here 👇 where the body[] will be 💅 rendered */}

      <Body body={body} color={color} imageClassName='md:w-1/2' ButtonClassName='mx-2 my-5' modal={modal} setModal={setModal} />

    </>
  )
}

export async function getStaticProps({ preview = false }) {
    // linkQuery is the extra step I do to get all relevant data/content from the body[] like internal link references, file-url etc. 👉 see lib/queries for more
  const query = groq`*[_type == 'home'] {..., 
  tabs[]{..., ${linkQuery}},
  cta {..., ${linkQuery}},
  work {..., ${linkQuery}},
  'featuredNews': *[_type== 'news' && feature == true]{..., 'slug': '/news/'+ slug.current, ${linkQuery}}[0],
  'news': *[_type== 'news']{..., 'slug': '/news/'+ slug.current, ${linkQuery}} | order(publishedAt desc),
  'siteSettings': *[_type == 'siteSettings'][0]{
    ...,
    quickLinks[]{..., "title": @->title, "slug": "/"+  @-> slug.current},
  }
  }`
  const data = await getClient(preview).fetch(query)

  if (!data) { return { notFound: true, } }

  //this is an extra step you need if you want to be able to preview unpublished changes in the preview pane
  const page = filterDataToSingleItem(data, preview)

  return {
    props: {
      preview,
      data: { page, query }
    }
  }
}
