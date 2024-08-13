"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { FormSchemaType, formSchema as createFormSchema } from "@/schemas/form";

class UserNotFoundErr extends Error {}
class InvalidDataErr extends Error {}

export async function createForm(data: FormSchemaType) {
  const formValidation = createFormSchema.safeParse(data);
  if (!formValidation.success) {
    throw new InvalidDataErr();
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const newForm = await prisma.form.create({
    data: {
      name: data.name,
      userId: user.id,
      description: data.description,
    },
  });

  if (!newForm) {
    throw new Error("Something went wrong!");
  }

  return newForm.id;
}

export type GetFormStatsReturn = {
  visits: number;
  submissions: number;
  submissionRate: number;
  bounceRate: number;
};

export async function getFormStats(): Promise<GetFormStatsReturn> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = 100 - submissionRate;

  return { visits, submissions, submissionRate, bounceRate };
}
