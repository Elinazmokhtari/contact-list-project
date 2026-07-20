export default function Button(props) {
  return (
    <button
      {...props}
      className={` bg-pink-400 rounded-2xl text-white cursor-pointer disabled:opacity-50 ${props.className}`}
    >
      {props.text}
    </button>
  );
}
