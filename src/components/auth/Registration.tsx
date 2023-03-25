import toast from "../../utils/Toast";
import Button from "../Button";
import Input from "../Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { emailValidator, nameValidator, passwordValidator } from "../../utils/validators";
import { type FormEvent, useState } from "react";
import { StyledForm } from "../styles/Form.styled";
import { api } from "../../utils/api";

export const Register = () => {
  const createUser = api.userRouter.createUser.useMutation({
    onSuccess: (e) => (!e ? toast("User already exists.", "error") : toast("User created!", "success")),
  });
  const { register, watch } = useForm<InputType>({ resolver: yupResolver(schema) });
  const formData = watch();
  const [error, setError] = useState("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    schema
      .validate(formData)
      .then(async (data) => {
        setError("");
        createUser.mutate(data);
      })
      .catch((err) => error !== err && setError(err.message.toUpperCase()));
  };

  return (
    <StyledForm onSubmit={(e) => submitHandler(e)}>
      <Input id="name" type="text" placeholder="Name" register={register("name")} />
      <Input id="email" type="email" placeholder="Email" register={register("email")} />
      <Input id="password" type="password" placeholder="Password" register={register("password")} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button loading={createUser.isLoading} text={"Register"} />
    </StyledForm>
  );
};

type InputType = {
  email: string;
  name: string;
  password: string;
};

const schema = yup
  .object()
  .shape({
    password: passwordValidator,
    email: emailValidator,
    name: nameValidator,
  })
  .required();
