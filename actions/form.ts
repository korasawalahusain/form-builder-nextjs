'use server';

import { prisma } from '@lib';
import { FormElementInstance } from '@components';
import { currentUser } from '@clerk/nextjs/server';
import { Form, FormSubmissions } from '@prisma/client';
import { FormSchemaType, formSchema as createFormSchema } from '@schemas';

class UserNotFoundErr extends Error {}
class FormNotFoundErr extends Error {}
class InvalidDataErr extends Error {}

export async function createForm(data: FormSchemaType): Promise<number> {
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
    throw new Error('Something went wrong!');
  }

  return newForm.id;
}

export async function getForms(): Promise<Form[]> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const forms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return forms;
}

export async function getFormById(id: number): Promise<Form> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  return form;
}

export type FormWithFormSubmissions = Form & {
  formSubmissions: FormSubmissions[];
};

export async function getFormSubmissions(
  id: number,
): Promise<FormWithFormSubmissions> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      formSubmissions: true,
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  return form;
}

export async function getFormContentByURL(
  url: string,
): Promise<FormElementInstance[]> {
  const form = await prisma.form.update({
    where: {
      shareURL: url,
      published: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    select: {
      content: true,
      published: true,
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  return JSON.parse(form.content);
}

export async function submitFormByURL(
  url: string,
  content: { [key: string]: string },
): Promise<Form> {
  const form = await prisma.form.update({
    where: {
      shareURL: url,
      published: true,
    },
    data: {
      submissions: {
        increment: 1,
      },
      formSubmissions: {
        create: {
          content: JSON.stringify(content),
        },
      },
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  return form;
}

export async function publishFormById(id: number): Promise<Form> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      published: true,
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  return form;
}

export async function updateFormById(
  id: number,
  elements: FormElementInstance[],
): Promise<Form> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content: JSON.stringify(elements),
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  return form;
}

export type FormStats = {
  visits: number;
  submissions: number;
  submissionRate: number;
  bounceRate: number;
};

export async function getFormStats(): Promise<FormStats> {
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
  const bounceRate = visits > 0 ? 100 - submissionRate : 0;

  return { visits, submissions, submissionRate, bounceRate };
}

export type FormWithStats = Form & FormStats;

export async function getFormWithStatsById(id: number): Promise<FormWithStats> {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!form) {
    throw new FormNotFoundErr();
  }

  const visits = form.visits || 0;
  const submissions = form.submissions || 0;

  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0;
  const bounceRate = visits > 0 ? 100 - submissionRate : 0;

  return { ...form, submissionRate, bounceRate };
}
