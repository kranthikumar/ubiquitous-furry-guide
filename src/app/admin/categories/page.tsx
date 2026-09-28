import Link from "next/link";
import {
  EmptyRow,
  Notice,
  PageHeader,
  param,
  TableCard,
  td,
  th,
  withParams,
} from "@/components/admin/ui";
import { listAdminCategories } from "@/db/admin-queries";

export const metadata = { title: "Categories" };

export default async function AdminCategories({
  searchParams,
}: PageProps<"/admin/categories">) {
  const params = await searchParams;
  const rows = await listAdminCategories();
  return (
    <>
      <PageHeader
        title="Categories"
        action={{ href: "/admin/categories/new", label: "New category" }}
      />
      <Notice notice={param(params.notice)} />
      <p className="mb-4 text-sm text-muted">
        The chips at the top of the home page, in this order.
      </p>
      <TableCard>
        <thead className="border-b border-line bg-surface">
          <tr>
            <th className={`${th} w-20 text-right`}>Order</th>
            <th className={th}>Label</th>
            <th className={th}>Slug</th>
            <th className={`${th} text-right`}>Videos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.length === 0 && (
            <EmptyRow colSpan={4}>No categories yet.</EmptyRow>
          )}
          {rows.map((category) => (
            <tr key={category.slug} className="hover:bg-surface">
              <td className={`${td} text-right tabular-nums text-muted`}>
                {category.position}
              </td>
              <td className={td}>
                <Link
                  href={`/admin/categories/${category.slug}`}
                  className="font-medium text-ink hover:underline"
                >
                  {category.label}
                </Link>
              </td>
              <td className={`${td} text-muted`}>{category.slug}</td>
              <td className={`${td} text-right tabular-nums`}>
                <Link
                  href={withParams("/admin/videos", {
                    category: category.slug,
                  })}
                  className="hover:underline"
                >
                  {category.videos}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </>
  );
}
