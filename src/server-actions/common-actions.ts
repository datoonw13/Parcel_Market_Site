"use server";

import { revalidatePath as revalidate } from "next/cache";

export const revalidatePath1 = (path: string) => revalidate(path);
