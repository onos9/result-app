import { writable } from "svelte/store";

export interface Class {
  id: string;
  userId?: string[];
  name?: string;
  section?: string;
  arm?: "eyfs" | "primary";
}

const ClassStore = () => {
  const { subscribe, update } = writable<Class[]>([]);

  const create = (cls: Class) => {
    cls.id = crypto.randomUUID();
    update((prev) => [...prev, cls]);
  };

  const updateOne = (cls: Class) => {
    update((prev) => [...prev, cls]);
  };

  const deleteOne = (id: string) => {
    update((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    create,
    updateOne,
    deleteOne,
    subscribe,
    update,
  };
};

export const classRoom = ClassStore();
