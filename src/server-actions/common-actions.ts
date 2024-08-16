"use server";

import { revalidatePath as revalidate, revalidateTag as revalidateByTag } from "next/cache";

export const revalidatePath = (path: string) => revalidate(path);
export const revalidateTag = (tag: string) => revalidateByTag(tag);
