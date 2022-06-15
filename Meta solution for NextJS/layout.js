import Meta from './meta'
// Setup a alert banner, so your editors see if they are in preview mode or not.
import Alert from '../components/alert'

export default function Layout({ title, preview, children, description, image }) {

    // If you use multiple image meta tags, it is easier to get the url here
  const openGraph = urlFor(image).width(1200).height(630).url();

  return (
    <>
      <Meta description={description} image={openGraph} title={title}/>
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>

    </>
  )
}