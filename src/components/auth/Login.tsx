import toast from "../../utils/Toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailValidator, passwordValidator } from "../../utils/validators";
import { StyledForm } from "../styles/Form.styled";
import { GithubIcon } from "lucide-react";

export const Login = () => {
  const { register: registerCredentials, watch: watchCredentials } = useForm<InputType>({ resolver: yupResolver(credentialsSchema) });
  const { register: registerMagic, watch: watchMagic } = useForm<InputType>({ resolver: yupResolver(magicSchema) });
  const Credentials = watchCredentials();
  const MagicLink = watchMagic();
  const [CredentialsLoading, setCredentialsLoading] = useState(false);
  const [MagicLoading, setMagicLoading] = useState(false);
  const [CredentialsError, setCredentialsError] = useState("");
  const [MagicError, setMagicError] = useState("");
  const router = useRouter();

  const submitHandlerCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    credentialsSchema
      .validate(Credentials)
      .then(async (data) => {
        setCredentialsError("");
        setCredentialsLoading(true);
        const login = await signIn("credentials", { email: data.email, password: data.password, redirect: false, callbackUrl: "/" });
        login?.status === 401 ? toast("Invalid Credentials", "warning") : login?.error && toast(login?.error, "error");
        setCredentialsLoading(false);
        login?.ok && router.push("/");
      })
      .catch((err) => CredentialsError !== err && setCredentialsError(err.message.toUpperCase()));
  };

  const submitHandlerMagicLink = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    magicSchema
      .validate(MagicLink)
      .then(async (data) => {
        setMagicError("");
        setMagicLoading(true);
        const login = await signIn("email", { email: data.email, redirect: false, callbackUrl: "/" });
        login?.error && toast(login?.error, "error");
        setMagicLoading(false);
        login?.ok && toast("Check your Email!", "success");
      })
      .catch((err) => MagicError !== err && setMagicError(err.message.toUpperCase()));
  };

  const submitHandlerGithub = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const login = await signIn("github", { redirect: false, callbackUrl: "/" });
    login?.error && toast(login?.error, "error");
    login?.ok && router.push("/");
  };

  return (
    <>
      <StyledForm onSubmit={(e) => submitHandlerCredentials(e)}>
        <Input id="email" type="email" placeholder="Email" register={registerCredentials("email")} />
        <Input id="password" type="password" placeholder="Password" register={registerCredentials("password")} />
        {CredentialsError && <p style={{ color: "red" }}>{CredentialsError}</p>}
        <Button loading={CredentialsLoading} text={"Login"} />
      </StyledForm>
      <Divider />
      <StyledForm onSubmit={(e) => submitHandlerMagicLink(e)}>
        <Input id="email" type="email" placeholder="Magic link" register={registerMagic("email")} />
        <Button loading={MagicLoading} text={"Magic link"} />
        {MagicError && <p style={{ color: "red" }}>{MagicError}</p>}
        <Divider />
      </StyledForm>
      <StyledForm>
        <Button text={<GithubButton />} onClick={(e) => submitHandlerGithub(e)} />
      </StyledForm>
    </>
  );
};

const Divider = () => <div className="my-4 h-0.5 border-t-0 bg-neutral-500 opacity-100 dark:opacity-50" />;
const GithubButton = () => (
  <div className="flex gap-2">
    <GithubIcon /> <p>Continue with Github</p>
  </div>
);

type InputType = {
  email: string;
  password: string;
};

const credentialsSchema = yup
  .object()
  .shape({
    password: passwordValidator,
    email: emailValidator,
  })
  .required();

const magicSchema = yup
  .object()
  .shape({
    email: emailValidator,
  })
  .required();
