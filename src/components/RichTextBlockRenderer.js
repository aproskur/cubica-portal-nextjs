'use client';

import parse from 'html-react-parser';

const RichTextBlockRenderer = ({ blocks }) => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return <p>Описание не доступно</p>;
    }

    return (
        <div>
            {blocks.map((block, index) => {
                const htmlString = (block.children || [])
                    .map((child) => child?.text || '')
                    .join('');

                return (
                    <div key={index}>
                        {htmlString.trim() ? parse(htmlString) : null}
                    </div>
                );
            })}
        </div>
    );
};

export default RichTextBlockRenderer;
