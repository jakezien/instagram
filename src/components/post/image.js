import PropTypes from "prop-types";

export default function Image({ src, caption, className }) {
  return <img src={src} alt={caption} className={className} />;
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
