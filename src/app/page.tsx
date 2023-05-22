import MemeDisplay from "./(components)/MemeDisplay";
import { MemeEditor } from "./(components)/MemeEditor";
import memeTemplates from "./(data)/memeTemplates";
import { Meme, MemeTemplate } from "./(data)/types";

export default async function Home() {
  const template = await fetch("http://localhost:3000/api/meme-templates");
  const templateData = (await template.json()) as MemeTemplate[];

  const memesReq = await fetch("http://localhost:3000/api/memes", {
    cache: "no-cache",
  });
  const memes = (await memesReq.json()) as Meme[];

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
