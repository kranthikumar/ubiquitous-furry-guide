import { PageHeader } from "@/components/admin/ui";
import { nextCategoryPosition } from "@/db/admin-queries";
import { createCategory } from "../actions";
import { CategoryForm } from "../category-form";

export const metadata = { title: "New category" };

export default async function NewCategory() {
  return (
    <>
      <PageHeader
        title="New category"
        back={{ href: "/admin/categories", label: "Categories" }}
      />
      <CategoryForm
        action={createCategory}
        nextPosition={await nextCategoryPosition()}
      />
    </>
  );
}
