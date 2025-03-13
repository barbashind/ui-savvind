import classes from './TextHighlith.module.css';
import classNames from 'classnames';

export const TextHighlith = (
    text: string | undefined,
    filter: string | null | undefined,
    className?: string
) => {
    if (!filter || !text) {
        return text;
    }
    const regexp = new RegExp(filter, 'ig');
    const matchValue = text.match(regexp);
    if (matchValue) {
        return text.split(regexp).map((s: string, index: number, array: string[]) => {
            if (index < array.length - 1) {
                const c = matchValue.shift();
                return (
                    <>
                        <text className={className}>{s}</text>
                        <text className={classNames(classes.highlith)}>{c}</text>
                    </>
                );
            }
            return (
                <>
                    <text className={className}>{s}</text>
                </>
            );
        });
    }
    return text;
};

export default TextHighlith;
