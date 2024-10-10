import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/label";
import { cn } from "./lib/utils";

export function App() {
  const form = useForm({
    defaultValues: {
      links: [
        { title: "Link 01", url: "https://link01.com.br" },
        { title: "Link 02", url: "https://link02.com.br" },
      ],
    },
  });

  const links = useFieldArray({
    control: form.control,
    name: "links",
  });

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDraggingIndex(index);
  }

  function handleDragEnd() {
    setDraggingIndex(null);
  }

  function handleReorder(newOrder: typeof links.fields) {
    if (draggingIndex === null) return;

    const draggingLink = links.fields[draggingIndex];

    newOrder.forEach((link, index) => {
      if (link === draggingLink) {
        links.move(draggingIndex, index);
        setDraggingIndex(index);
      }
    });
  }

  const handleSubmit = form.handleSubmit(console.log);

  return (
    <FormProvider {...form}>
      <div className="grid place-items-center min-h-screen my-4">
        <div className="w-full max-w-2xl p-2">
          <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
          <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
            {links.fields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => links.prepend({ title: "", url: "https://" })}
              >
                <PlusCircleIcon className="size-4 mr-1" />
                Adicionar no topo da lista
              </Button>
            )}
            <Reorder.Group
              axis="y"
              values={links.fields}
              onReorder={handleReorder}
            >
              {links.fields.map((link, index) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  isDraggingNotActive={
                    draggingIndex !== null && draggingIndex !== index
                  }
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onRemove={() => links.remove(index)}
                />
              ))}
            </Reorder.Group>
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() => links.append({ title: "", url: "https://" })}
            >
              <PlusCircleIcon className="size-4 mr-1" />
              Adicionar novo Link
            </Button>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  links.insert(2, {
                    title: "Indice 2",
                    url: "",
                  })
                }
              >
                Insert
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => links.move(1, 0)}
              >
                Move
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  links.replace([{ title: "Replace", url: "ReplaceAll" }])
                }
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => links.swap(1, 0)}
              >
                Swap
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  links.update(0, { title: "Updated", url: "updated" })
                }
              >
                Update
              </Button>
            </div>
            <Button className="w-full">Submit</Button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}

interface ILinkItemProps {
  link: {
    id: string;
    title: string;
    url: string;
  };
  index: number;
  isDraggingNotActive: boolean;
  onDragStart(index: number): void;
  onDragEnd(): void;
  onRemove(): void;
}

function LinkItem({
  link,
  index,
  isDraggingNotActive,
  onDragStart,
  onDragEnd,
  onRemove,
}: ILinkItemProps) {
  const controls = useDragControls();
  const form = useFormContext();

  return (
    <Reorder.Item
      key={link.id}
      value={link}
      className={cn(
        "flex gap-4 transition-opacity relative",
        isDraggingNotActive && "opacity-50"
      )}
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      dragControls={controls}
      dragListener={false}
    >
      <div className="flex-1 flex gap-4 items-end">
        <Button
          type="button"
          variant="link"
          onPointerDown={(e) => controls.start(e)}
          tabIndex={-1}
          className="cursor-grab"
        >
          <GripVertical className="size-4" />
        </Button>
        <div className="flex-1 space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" {...form.register(`links.${index}.title`)} />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="url">Url</Label>
          <Input id="url" {...form.register(`links.${index}.url`)} />
        </div>
        <Button type="button" variant="destructive" onClick={onRemove}>
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </Reorder.Item>
  );
}
