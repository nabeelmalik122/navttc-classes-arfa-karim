import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />

      <input {...register("email")} />

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
