import { MemeDisplay } from "./(components)/MemeDisplay";
import { MemeEditor } from "./(components)/MemeEditor";
import { Meme, MemeTemplate } from "./(data)/types";

export default async function Home() {
  const template = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/meme-templates`
  );

  const templateData: MemeTemplate[] | null = template.ok
    ? await template.json()
    : null;
  console.log("🚀 ~ file: page.tsx:8 ~ Home ~ templateData:", templateData);

  const memesReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memes`, {
    cache: "no-cache",
  });
  const memes: Meme[] = memesReq.ok ? await memesReq.json() : [];

  if (!templateData) return null;

  return (
    <main className="mx-auto max-w-5xl p-2">
      <MemeEditor templates={templateData} />
      <h2 className="mt-5 text-3xl font-bold">Memes</h2>
      <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {memes.map((meme) => (
          <MemeDisplay
            key={meme.id}
            template={
              templateData.find((template) => template.id === meme.template)!
            }
            values={meme.values}
          />
        ))}
      </div>
    </main>
  );
}
