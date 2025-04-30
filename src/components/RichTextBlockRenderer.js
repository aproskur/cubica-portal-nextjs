'use client';

const renderChildren = (children) => {
    return children.map((child, idx) => {
        if (!child.text) return null;

        let content = child.text;

        if (child.bold) content = <strong key={idx}>{content}</strong>;
        if (child.italic) content = <em key={idx}>{content}</em>;
        if (child.underline) content = <u key={idx}>{content}</u>;
        if (child.strikethrough) content = <s key={idx}>{content}</s>;

        // If multiple styles apply
        if (child.bold && child.italic) {
            content = <strong key={idx}><em>{child.text}</em></strong>;
        }

        if (child.bold && child.underline) {
            content = <strong key={idx}><u>{child.text}</u></strong>;
        }

        // etc. — optionally expand for other combinations

        // Fallback
        if (!child.bold && !child.italic && !child.underline && !child.strikethrough) {
            content = <span key={idx}>{child.text}</span>;
        }

        return content;
    });
};

const RichTextBlockRenderer = ({ blocks }) => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return <p>Описание не доступно</p>;
    }

    return (
        <div>
            {blocks.map((block, index) => {
                switch (block.type) {
                    case 'paragraph':
                        return <p key={index}>{renderChildren(block.children)}</p>;

                    case 'heading':
                        const HeadingTag = `h${block.level || 2}`;
                        return <HeadingTag key={index}>{renderChildren(block.children)}</HeadingTag>;

                    case 'list':
                        const ListTag = block.format === 'unordered' ? 'ul' : 'ol';
                        return (
                            <ListTag key={index}>
                                {block.children?.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        {renderChildren(item.children)}
                                    </li>
                                ))}
                            </ListTag>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default RichTextBlockRenderer;

