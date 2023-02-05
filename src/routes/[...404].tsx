import { Title } from "solid-start";
import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <div class="w-full p-4 space-y-2">
        <h1 class="font-bold text-xl">Page Not Found</h1>
      </div>
    </main>
  );
}
