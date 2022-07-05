import React from "react";
import {
    Heading
  } from '@sanity/ui'

export function createHeading(title, order) {
    return {
        inputComponent: (field) => (
            <Heading as={order} size={3} >
                {field.type.title}
            </Heading>
        ),
        name: `heading${title
            .toLowerCase()
            .replace(/\s/g, "")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")}`,
        title,
        type: "string",
    };
}