interface ImageData {
    src: string,
    className: string
    style:any
}
const Image = (props: ImageData) => {
    const { src, className, style } = props
    return (
        <>
            <img className={className} src={src} alt="img" style={style} />
        </>
    );
}

export default Image;