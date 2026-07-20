export default function Input(props) {
  return (
    <div>
      <input
        type="text"
        {...props}
        className={` bg-white w-full rounded-[10px] p-3 border border-stone-400 outline-none focus:border-pink-400 ${props.className}`}
      />
    </div>
  );
}
