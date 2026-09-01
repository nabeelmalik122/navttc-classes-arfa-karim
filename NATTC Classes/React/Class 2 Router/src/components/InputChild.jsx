// Parent se setText function receive kiya
function InputChild({ text, setText }) {
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
      />
    </div>
  );
}

export default InputChild;
