"use server";

import { superAdminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PageItem = z.object({
  title: z.string().min(1, "Page title is required"),
  slug: z.string().min(1, "Page slug is required"),
  contentType: z.enum(["single", "dynamic"]),
  parentSlug: z.string().optional(),
});

const Input = z.object({
  instituteId: z.string().min(1, "instituteId is required"),
  pages: z.array(PageItem),
});

export const savePages = superAdminActionClient
  .schema(Input)
  .action<{ success: true; message: string }>(async ({ parsedInput }) => {
    const { instituteId, pages } = parsedInput;

    // If no selection: just clear and return
    if (pages.length === 0) {
      await prisma.$transaction([
        prisma.seoContent.deleteMany({ where: { page: { instituteId } } }),
        prisma.content.deleteMany({ where: { page: { instituteId } } }),
        prisma.page.deleteMany({ where: { instituteId } }),
      ]);
      revalidatePath("/sadmin/institutes");
      return { success: true, message: "Pages saved" };
    }

    // Clear old data quickly
    await prisma.$transaction([
      prisma.seoContent.deleteMany({ where: { page: { instituteId } } }),
      prisma.content.deleteMany({ where: { page: { instituteId } } }),
      prisma.page.deleteMany({ where: { instituteId } }),
    ]);

    // Create pages - first pass: create all pages without parent references
    await prisma.page.createMany({
      data: pages.map((p) => ({
        instituteId,
        title: p.title.trim(),
        slug: p.slug.trim(),
        status: "ACTIVE",
        contentType: p.contentType === "single" ? "SINGLE" : "DYNAMIC",
      })),
      skipDuplicates: true,
    });

    // Second pass: update parent references
    const createdPages = await prisma.page.findMany({
      where: { instituteId, slug: { in: pages.map((p) => p.slug) } },
      select: { id: true, slug: true, title: true, contentType: true },
    });

    const pagesBySlug = new Map(createdPages.map((p: typeof createdPages[0]) => [p.slug, p]));

    // Update parent references for pages that have a parent
    const updatePromises = pages
      .filter(p => p.parentSlug)
      .map(p => {
        const page = pagesBySlug.get(p.slug);
        const parent = pagesBySlug.get(p.parentSlug!);

        if (page && parent) {
          return prisma.page.update({
            where: { id: page.id },
            data: { parentId: parent.id },
          });
        }
        return null;
      })
      .filter(Boolean);

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
    }

    // Fetch created pages for SEO and content creation
    const created = await prisma.page.findMany({
      where: { instituteId, slug: { in: pages.map((p) => p.slug) } },
      select: { id: true, slug: true, title: true, contentType: true },
    });

    const seoRows = created.map((p) => ({
      pageId: p.id,
      title: p.title,
      canonical_url: p.slug,
    }));

    const contentRows = created
      .filter((p) => p.contentType === "SINGLE")
      .map((p) => ({
        pageId: p.id,
        title: p.title,
      }));

    const writes = [];
    if (seoRows.length) writes.push(prisma.seoContent.createMany({ data: seoRows }));
    if (contentRows.length) writes.push(prisma.content.createMany({ data: contentRows }));
    if (writes.length) await prisma.$transaction(writes);

    revalidatePath("/sadmin/institutes");

    return { success: true, message: "Pages saved" };
  });
