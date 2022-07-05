import React from "react";
import {
    Container,
    Inline
  } from '@sanity/ui'



export function createDescription({ title, links, group }) {

    return {
        inputComponent: (field) => (
            <Container width={100}>
                {field.type.title}
                {links && <>
                    <p>Edit or add Items here 👇</p>
                    <Container width={100}>
                        <Inline space={[3, 3, 4]}>
                        {links &&
                            links.map((item, index) =>
                            <a href={item.url} key={`btn${index}`} style={{ textDecoration: 'none'}}>
                            <Button
                                fontSize={[2, 2, 3]}
                                icon={AddIcon}
                                mode="ghost"
                                padding={[3, 3, 4]}
                                text={item.title}
                            />
                            </a>
                            )
                        }
                        </Inline>
                    </Container>
                </>}
            </Container>
        ),
        name: `description${"id" + Math.random().toString(16).slice(2)}`,
        title,
        type: "string",
        group: group
    };
}