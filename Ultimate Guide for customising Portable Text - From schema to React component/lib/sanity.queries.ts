import { groq } from "next-sanity";

const bodyField = groq`
  body[]{
    ...,
    // add your custom blocks here (we don't need to do that for images, because we will get the image url from the @sanity/image-url package)
    
    markDefs[]{ 
        // so here we make sure to enclude all other data points are included
        ..., 
        // then we define that if a child of the markDef array is of the type internalLink, we want to get the referenced doc value of slug and combine that with a / 
        _type == "internalLink" => { "href": "/"+ @.reference-> slug.current },
        },
  }
`;
const pageFields = groq`
  _id,
  title,
  description,
  "slug": slug.current,
  ${bodyField}
`;

export const pageQuery = groq`
*[_type == "page" && slug.current == $slug][0] {
  ${pageFields}
}
`;
