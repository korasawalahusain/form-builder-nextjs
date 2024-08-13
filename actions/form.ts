"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundErr extends Error {}

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
