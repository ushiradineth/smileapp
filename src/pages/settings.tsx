import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import NextImage from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loader from "../components/Loader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/AlertboxMenu";
import { env } from "../env.mjs";
import { api } from "../utils/api";
import { DefaultUserImage } from "../utils/default";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";

const Settings: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user.name || "");
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<File>();
  const [imageURL, setImageURL] = useState<File>();
  const [edited, setEdited] = useState(false);
  const deleteBtn = useRef<HTMLButtonElement>(null);

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY);

  const updateName = api.userRouter.updateName.useMutation({
    onSettled: () => location.reload(),
    onSuccess: () => toast("Name Updated", { hideProgressBar: true, autoClose: 2000, type: "success" }),
    onError: () => toast("Failed to change Name", { hideProgressBar: true, autoClose: 2000, type: "error" }),
  });
  const updateImage = api.userRouter.updateImage.useMutation({
    onSettled: () => location.reload(),
    onSuccess: () => toast("Image Updated", { hideProgressBar: true, autoClose: 2000, type: "success" }),
    onError: () => toast("Failed to change Image", { hideProgressBar: true, autoClose: 2000, type: "error" }),
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setEdited(true);
    setImage(e.target.files[0]);
  };

  const onSave = async () => {
    if (typeof image !== "undefined" && typeof imageURL !== "undefined") {
      const { error } = await supabase.storage.from(env.NEXT_PUBLIC_SUPABASE_BUCKET).upload(`/Users/${session?.user.id}/ProfilePicture`, imageURL, {
        cacheControl: "1",
        upsert: true,
      });

      if (error) toast("Failed to upload Image", { hideProgressBar: true, autoClose: 2000, type: "error" });
      else updateImage.mutate({ id: session?.user?.id || "", image: `${env.NEXT_PUBLIC_SUPABASE_IMAGE_URL}Users/${session?.user.id}/ProfilePicture` });
    }

    if (name !== session?.user.name)
      updateName.mutate(
        { id: session?.user?.id || "", name },
        {
          onSuccess: () => router.query.setName && router.push("/?initial=true"),
        }
      );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (Boolean(e.target.value !== session?.user.name && e.target.value !== "") !== edited) setEdited(e.target.value !== session?.user.name && e.target.value !== "");
    setName(e.target.value);
  };

  useEffect(() => {
    const img = new (Image as any)();
    img.src = image ? URL.createObjectURL(image) : session?.user.image;
    img.onload = async function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 240;
      canvas.height = 240;
      ctx?.drawImage(img, 0, 0, 240, 240);
      const blob = await (await fetch(canvas.toDataURL("image/jpeg"))).blob();
      const file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
      setImageURL(file);
    };
    img.setAttribute("crossorigin", "anonymous");
  }, [image]);

  if (typeof session === "undefined" || session === null || typeof session.user === "undefined") return <Loader />;

  return (
    <>
      <Head>
        <title>{session.user.name} on SmileApp</title>
        <meta name="description" content="SmileApp by Ushira Dineth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-40">
        <div className="w-full flex flex-col items-center gap-4 px-8 py-4 border rounded-t-lg">
          <div className="flex gap-4 items-center">
            <NextImage src={imageURL ? URL.createObjectURL(imageURL) : DefaultUserImage} className={"rounded-full h-24 w-24 "} height={200} width={200} alt={"User Image"} />
            <input type="file" accept=".png, .jpg, .jpeg" className="hidden" ref={imageRef} onChange={handleFileChange} />
            <button className="cursor-pointer text-sm text-blue-400 w-fit h-fit" onClick={() => imageRef.current?.click()}>
              Change profile picture
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className={"flex h-[35px] items-center justify-start gap-2 rounded-lg px-4 border"}>
              <input onChange={(e) => handleInputChange(e)} defaultValue={session.user.name || ""} placeholder="Name" autoComplete="off" type="text" id={"Name"} className={"h-full placeholder:text-gray-500 focus:outline-none"} maxLength={50} minLength={1}></input>
            </div>
            {router.query.setName && <p className="text-red-500">Set your name before continuing</p>}
            <button disabled={!edited || updateImage.isLoading || updateName.isLoading} onClick={() => onSave()} className="h-12 w-24 cursor-pointer rounded-2xl disabled:cursor-not-allowed bg-gray-900 disabled:bg-gray-300 disabled:text-gray-700 text-gray-100">
              {updateImage.isLoading || updateName.isLoading ? <Loader loaderOnly={true} /> : "Save"}
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-4 px-8 py-4 border border-t-0 rounded-b-lg">
          <DeleteMenu userID={session.user.id} btnref={deleteBtn} disabled={updateImage.isLoading || updateName.isLoading} />
        </div>
      </main>
    </>
  );
};

export default Settings;

function DeleteMenu({ ...props }: { userID: string; btnref: React.RefObject<HTMLButtonElement>; disabled: boolean }) {
  const deleteUser = api.userRouter.deleteUser.useMutation({
    onSettled: () => location.reload(),
    onSuccess: () => toast("User Deleted", { hideProgressBar: true, autoClose: 2000, type: "success" }),
    onError: () => toast("Failed to delete User", { hideProgressBar: true, autoClose: 2000, type: "error" }),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger ref={props.btnref} disabled={props.disabled} className="h-12 px-8 cursor-pointer rounded-2xl disabled:cursor-not-allowed bg-gray-900 disabled:bg-gray-300 text-gray-100">
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteUser.mutate({ id: props.userID });
            }}
          >
            {deleteUser.isLoading ? <Loader loaderOnly={true} /> : "Delete Account"}
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
