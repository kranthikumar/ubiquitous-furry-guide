import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/form-controls";
import { PageHeader } from "@/components/admin/ui";
import { getAdminCategory } from "@/db/admin-queries";
import { deleteCategory, updateCategory } from "../actions";
import { CategoryForm } from "../category-form";

export const metadata = { title: "Edit category" };

export default async function EditCategory({
  params,
}: PageProps<"/admin/categories/[slug]">) {
  const { slug } = await params;
  const category = await getAdminCategory(slug);
  if (!category) notFound();
  return (
    <>
      <PageHeader
        title="Edit category"
        back={{ href: "/admin/categories", label: "Categories" }}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <DeleteButton
          action={deleteCategory.bind(null, category.slug)}
          title="Delete this category?"
        >
          <p>
            <strong className="text-ink">{category.label}</strong> will be
            removed from the home page and untagged from {category.videos}{" "}
            {category.videos === 1 ? "video" : "videos"}. The videos themselves
            are kept.
          </p>
        </DeleteButton>
      </div>
      <CategoryForm
        action={updateCategory.bind(null, category.slug)}
        category={category}
        nextPosition={category.position}
      />
    </>
  );
}
