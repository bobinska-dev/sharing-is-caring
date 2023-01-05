// Body.jsx
import { PortableText } from "@portabletext/react";
import { urlForImage } from "lib/sanity.image";
import Image from "next/image";

const Body = (props: any) => {
  // we pass the content, width & height of the images into each instance of the Body component
  const { content, imgWidth, imgHeight } = props;

  const customBlockComponents = {
    // first we tackle our custom block types
    types: {
      image: ({ value }) => {
        // we need to get the image source url, and since @sanity/image-url will give us optimised images for each instance we use it
        const imgUrl = urlForImage(value.assset)
          .height(imgHeight)
          .width(imgWidth)
          .url();

        return (
          <Image
            width={imgWidth}
            height={imgHeight}
            alt={value.alt}
            src={imgUrl}
            sizes="100vw"
            priority={false}
          />
        );
      },
    },

    // then we define how the annotations should be rendered
    marks: {
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} target="_blank" rel={rel}>
            {children}
          </a>
        );
      },
      internalLink: ({ children, value }) => {
        return <a href={value.href}>{children}</a>;
      },
    },
  };

  return <PortableText value={[props]} components={customBlockComponents} />;
};
export default Body;
