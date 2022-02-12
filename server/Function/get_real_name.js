export default function get_real_name(name) {
    const searchRegExp = '.';
    const replaceWith = ' ';
    const newName = name.replaceAll(searchRegExp, replaceWith);
    return newName;
}