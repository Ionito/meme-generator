"use client";
import { useForm } from "react-hook-form";
import { MemeTemplate } from "../(data)/types";
import { MemeDisplay } from "./MemeDisplay";
import { ChangeEventHandler, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  templates: MemeTemplate[];
};

const textValues = (template: MemeTemplate) =>
  template.textareas.reduce(
    (values, ta) => ({
      ...values,
      [ta.id]: ta.text,
    }),
    {} as Record<string, string>
  );

export const MemeEditor = ({ templates }: Props): JSX.Element => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      template: templates[0].id,
      values: textValues(templates[0]),
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const templateId = watch("template");
  const template = templates.find((template) => template.id === templateId)!;

  const values = watch("values");

  const onSubmit = async (data: {
    template: string;
    values: Record<string, string>;
  }) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: data.template,
        values: data.values,
      }),
    });
    startTransition(() => {
      router.refresh();
    });
  };

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newTemplate = templates.find(
      (template) => template.id === event.target.value
    )!;

    setValue("template", newTemplate.id);
    setValue("values", textValues(newTemplate));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-[60%_40%]">
        <MemeDisplay template={template} values={values} />
        <div className="px-2">
          <select
            className="select w-full"
            value={templateId}
            onChange={handleChange}
          >
            <option disabled>Pick your template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.id}
              </option>
            ))}
          </select>
          {template.textareas.map((textarea, index) => (
            <div key={index} className="mt-5">
              <label htmlFor={textarea.id}>{textarea.id}</label>
              <div>
                <input
                  className="input-bordered input w-full"
                  type="text"
                  {...register(`values.${textarea.id}`)}
                />
              </div>
            </div>
          ))}
          <button className="btn mt-5"> Let&apos;s Go!</button>
        </div>
      </div>
    </form>
  );
};
