/*
1. BLOCK TYPES
    First we filter through the body array (which are the block in the richTextEditor) and find all BLOCK TYPES, that need some extra love
    I want to get the file-url, so ppl can download it later through a button
    I need to get the infos of the page doc that i am referencing in the internal Link (which is a Button here)
    then I get the data from the referenced testimonial doc, which will be embeded in the body-element
*/
/*
2. ANNOTATIONS (inline Stuff)
    Because annotations are stored as markDefs and later rederenced in the blocks, we need to filter through their definition and get all we need to display them properly.
    Publications & Jobs are docs in my sanity studio, so we need to get their data as well but we don't need all the data, just some of them as you can see below
*/

export const linkQuery = `
  body[]{ ...,  
    _type == "file" => {..., "url": @.asset->url},  
    _type == "internalBtn" => { 
        "reference": @.reference->_type,
        "slug": "/"+  @.reference-> slug.current },
    _type == "testimonial" => {..., "reference": @->}, 

    markDefs[]{ 
        ..., 
        _type == "internalLink" => { "slug": "/"+ @.reference-> slug.current },
        _type == "publication" =>  {"reference": @->{url, title, description} },
        _type == "job" =>  {"reference": @->{url, title, description, location} }
        },
    }
`