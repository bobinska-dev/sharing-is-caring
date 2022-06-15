import { groq } from "next-sanity";
import Layout from './layout';
// Your setup for Sanity
import { getClient, usePreviewSubscription, filterDataToSingleItem } from '@lib/sanity';


export default function Post({ data, preview }) {

  const { data: previewData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.page,
    enabled: preview,
  })
  const page = filterDataToSingleItem(previewData, preview)

  /* deconstruct your props */
  const { image, title, description  } = data?.page;



  return (
    <>
      <Layout preview={preview} image={image} description={description} title={title}>

            {/* This is where the rest of the fields go */}
            
      </Layout>
    </>
  )
}

// Paths
export async function getStaticPaths() {
  const slugQuery = groq`*[_type == 'werk'&& defined(slug.current)][]`
  const data = await sanityClient.fetch(slugQuery)
  if (!data) { return { notFound: true, } }

  const paths = data.map(page => {
      return {
          params: { slug: page.slug.current.toString() }
      }
  })

  return {
      paths,
      fallback: false
  }
}

// Page Props
export async function getStaticProps({ params, preview = false }) {

  const query = groq`*[_type == 'blogPost' && slug.current == $slug]`

  const queryParams = { slug: params.slug }
  const data = await getClient(preview).fetch(query, queryParams)
  if (!data) { return { notFound: true } }

  const page = filterDataToSingleItem(data, preview)

  return {
      props: {
          preview,
          data: { page, query, queryParams },
          revalidate: 10 // In seconds
      },
  }
}
